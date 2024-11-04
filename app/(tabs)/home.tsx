import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ToggleButton from "@/components/ToggleButton";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from "react-native-calendars";
import Timeline from "@/components/Timeline";
import { useRouter, useLocalSearchParams } from "expo-router";
import { EventItem } from "@/types/event";
import { loadEventsForDate, saveEvent } from "@/hooks/storage";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface WeeklyTimelineProps {
  events: EventItem[];
  onHandleDetails: (event: EventItem) => void;
  selectedDate: string;
}

const WeeklyTimeline: React.FC<WeeklyTimelineProps> = ({
  events,
  onHandleDetails,
  selectedDate,
}) => {
  const [currentTimeOffset, setCurrentTimeOffset] = useState(0);

  const calculateCurrentTimeOffset = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes * (HOUR_HEIGHT / 60);
  };

  useEffect(() => {
    setCurrentTimeOffset(calculateCurrentTimeOffset());

    const interval = setInterval(() => {
      setCurrentTimeOffset(calculateCurrentTimeOffset());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const calculateEventPosition = (startDate: string | Date): number => {
    const date = new Date(startDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes * (HOUR_HEIGHT / 60);
  };

  const calculateEventHeight = (
    startDate: string | Date,
    endDate: string | Date
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    return durationMinutes * (HOUR_HEIGHT / 60);
  };

  const getAllWeekEvents = async (): Promise<EventItem[]> => {
    const selectedDateObj = new Date(selectedDate);
    const weekStart = new Date(selectedDateObj);
    weekStart.setDate(selectedDateObj.getDate() - selectedDateObj.getDay());

    let allEvents: EventItem[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const dateString = currentDate.toISOString().split("T")[0];
      const dayEvents = await loadEventsForDate(dateString);
      allEvents = [...allEvents, ...dayEvents];
    }
    return allEvents;
  };

  const [weekEvents, setWeekEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    getAllWeekEvents().then((events) => setWeekEvents(events));
  }, [selectedDate]);

  return (
    <View style={styles.weeklyTimelineContainer}>
      <View style={styles.timeColumn}>
        {Array.from({ length: 24 }, (_, hour) => (
          <View
            key={hour}
            style={[styles.timeLabelBlock, { height: HOUR_HEIGHT }]}
          >
            <Text style={styles.timeLabel}>
              {hour < 10 ? `0${hour}:00` : `${hour}:00`}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.weeklyEventsContainer}>
        {Array.from({ length: 7 }, (_, dayIndex) => {
          const today = new Date().getDay();
          const isToday = dayIndex === today;

          return (
            <View
              key={dayIndex}
              style={[
                styles.dayColumn,
                {
                  backgroundColor: isToday ? "#ffffff" : "#f5f5f5",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: isToday ? 0.3 : 0.2,
                  shadowRadius: isToday ? 2 : 0.1,
                  elevation: 5,
                },
              ]}
            >
              {weekEvents
                .filter(
                  (event) => new Date(event.startDate).getDay() === dayIndex
                )
                .map((event, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.eventItem,
                      {
                        top: calculateEventPosition(event.startDate),
                        height: calculateEventHeight(
                          event.startDate,
                          event.endDate
                        ),
                        backgroundColor: event.category?.color || "#E6E6FA",
                      },
                    ]}
                    onPress={() => onHandleDetails(event)}
                  >
                    <View style={styles.eventContent}>
                      {event.category?.icon && (
                        <Ionicons
                          name={
                            event.category
                              .icon as keyof typeof Ionicons.glyphMap
                          }
                          size={16}
                          color="#000000"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          );
        })}

        <View
          style={[
            styles.currentTimeLine,
            { top: currentTimeOffset - LINE_THICKNESS / 2 },
          ]}
        />
      </View>
    </View>
  );
};

const HOUR_HEIGHT = 60;
const CIRCLE_DIAMETER = 12;
const LINE_THICKNESS = 2;
const screenWidth = Dimensions.get("window").width;

export default function Home() {
  const router = useRouter();
  const { newEvent } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [currentYearMonth, setCurrentYearMonth] = useState(() => {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return {
      year: koreaTime.getFullYear(),
      month: koreaTime.getMonth() + 1
    };
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return koreaTime.toISOString().split('T')[0];
  });

  const generateDates = (selectedDate: number) => {
    const dates = [];
    const baseDate = new Date(selectedDate);
    const koreaTime = new Date(baseDate.getTime() + (9 * 60 * 60 * 1000));

    for (let i = -2; i <= 2; i++) {
      const date = new Date(koreaTime);
      date.setDate(koreaTime.getDate() + i);
      dates.push({
        id: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('ko-KR', { weekday: 'long' }),
      });
    }
    return dates;
  };

  const [dates, setDates] = useState(() => {
    const now = new Date();
    const koreaTime = now.getTime() + (9 * 60 * 60 * 1000);
    return generateDates(koreaTime);
  });

  const handleDateSelect = (date: string) => {
    const selectedDateTime = new Date(date);
    const koreaTime = new Date(selectedDateTime.getTime() + (9 * 60 * 60 * 1000));
    
    setSelectedDate(koreaTime.toISOString().split('T')[0]);
    setCurrentYearMonth({
      year: koreaTime.getFullYear(),
      month: koreaTime.getMonth() + 1
    });

    const newDates = generateDates(koreaTime.getTime());
    setDates(newDates);
  };

  const [isDaily, setIsDaily] = useState(true); 
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef2 = useRef<BottomSheet>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const fabOpacity = useSharedValue(1); 

  
  const flatListRef = useRef<FlatList>(null);

  const fetchEvents = useCallback(async (date: string) => {
    try {
      const eventsForDate = await loadEventsForDate(date);
      setEvents(eventsForDate);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate, fetchEvents]);

  useEffect(() => {
    if (newEvent) {
      const parsedEvent = JSON.parse(newEvent as string);
      parsedEvent.startDate = new Date(parsedEvent.startDate);
      parsedEvent.endDate = new Date(parsedEvent.endDate);

     
      const eventDate = new Date(parsedEvent.startDate)
        .toISOString()
        .split("T")[0];
      setSelectedDate(eventDate);

     
      setDates(generateDates(new Date(eventDate).getTime()));

      
      setEvents((prevEvents) => {
        const updatedEvents = [...prevEvents, parsedEvent];
        saveEvent(parsedEvent);
        return updatedEvents;
      });
    }
  }, [newEvent]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents(selectedDate);
    }, [selectedDate, fetchEvents])
  );

  const handleEventPress = (event: EventItem) => {
    setSelectedEvent(event);
    bottomSheetRef.current?.expand();
  };

  const onHandleDetails = (event: EventItem) => {
    setSelectedEvent(event);
    console.log("이벤트 세부 정보:", event);

    bottomSheetRef2.current?.expand();
  };

  LocaleConfig.locales["ko"] = {
    monthNames: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    monthNamesShort: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    dayNames: [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ],
    dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
    today: "오늘",
  };

  LocaleConfig.defaultLocale = "ko";

  const ITEM_WIDTH = 70;
  const ITEM_MARGIN = 5;
  const { width: screenWidth } = Dimensions.get('window');

  const carouselRef = useRef<any>(null);

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = item.id === selectedDate;
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          isSelected && styles.selectedItemContainer,
        ]}
        onPress={() => handleDateSelect(item.id)}
      >
        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
          {new Date(item.id).getDate()}
        </Text>
        <View style={styles.divider} />
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
          {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

  <View style={styles.carouselContainer}>
    
  </View>

  useEffect(() => {
    if (isDaily && dates.length > 0) {
      flatListRef.current?.scrollToIndex({
        index: 2,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [selectedDate, isDaily]);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const snapPoints = useMemo(() => {
    return keyboardVisible ? ["80%"] : ["50%"];
  }, [keyboardVisible]);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleFABPress = () => {
    const formattedDate = `${currentYearMonth.year}-${String(currentYearMonth.month).padStart(
      2,
      "0"
    )}-${String(new Date(selectedDate).getDate()).padStart(2, "0")}`;
    router.push(`/addEvent?date=${formattedDate}`);
  };

  const handleSheetChanges = useCallback(
    (index: number) => {
      setIsBottomSheetOpen(index >= 0);
      fabOpacity.value = withTiming(index >= 0 ? 0 : 1, { duration: 300 });
    },
    [fabOpacity]
  );

  const animatedFabStyle = useAnimatedStyle(() => {
    return {
      opacity: fabOpacity.value,
    };
  });

  const handleOpenSecondSheet = () => {
    bottomSheetRef2.current?.expand();
  };

  
  const generateWeekDates = (baseDate: Date) => {
    const dates = [];
    const start = new Date(baseDate);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push({
        date: date.getDate(),
        day: ["일", "월", "화", "수", "목", "금", "토"][i],
        fullDate: date.toISOString().split("T")[0],
      });
    }
    return dates;
  };

  const renderWeekItem = ({ item }: any) => {
    const isSelected = item.fullDate === selectedDate;
    const isToday = item.fullDate === new Date().toISOString().split("T")[0];

    return (
      <View style={[styles.weekItem, isSelected && styles.selectedWeekItem]}>
        <Text
          style={[
            styles.weekDayText,
            isSelected && styles.selectedWeekText,
            item.day === "일" && { color: "#FF0000" },
            item.day === "토" && { color: "#0000FF" },
          ]}
        >
          {item.day}
        </Text>
        <Text
          style={[
            styles.weekDateText,
            isSelected && styles.selectedWeekText,
            isToday && styles.todayText,
          ]}
        >
          {item.date}
        </Text>
      </View>
    );
  };

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 70,
      offset: 70 * index,
      index,
    }),
    []
  );

  const [tempMemo, setTempMemo] = useState<string>("");

  useEffect(() => {
    if (selectedEvent) {
      setTempMemo(selectedEvent.memo || "");
    }
  }, [selectedEvent]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={[styles.topRow, { marginTop: insets.top }]}>
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={handleOpenBottomSheet}
            >
              <Text style={styles.selectMonth}>
                {currentYearMonth.year}년 {currentYearMonth.month}월
              </Text>
              <Ionicons
                name={"chevron-down"}
                size={32}
                color={"#000000"}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <ToggleButton onToggle={(state) => setIsDaily(state)} />
          </View>
        </View>

        {isDaily ? (
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={dates}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              getItemLayout={getItemLayout}
              initialScrollIndex={2}
              onScrollToIndexFailed={() => {}}
            />
          </View>
        ) : (
          <View style={styles.weekContainer}>
            <View
              style={[
                styles.itemContainer,
                styles.timelineWidth,
                styles.blackCapsule,
              ]}
            >
              <Text style={styles.monthLabel}>m</Text>
            </View>

            <View style={styles.weekItemsContainer}>
              {generateWeekDates(new Date(selectedDate)).map((item, index) => {
                const isSelected = item.fullDate === selectedDate;

                return (
                  <TouchableOpacity
                    key={item.fullDate}
                    style={[
                      styles.itemContainer,
                      styles.weekItem,
                      isSelected && styles.selectedItemContainer,
                    ]}
                    onPress={() => setSelectedDate(item.fullDate)}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        isSelected && styles.selectedDateText,
                      ]}
                    >
                      {item.date}
                    </Text>
                    <View style={styles.divider} />
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText,
                      ]}
                    >
                      {item.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {isDaily && <View style={styles.middleContainer}></View>}

      <View
        style={[
          styles.bottomContainer,
          !isDaily && styles.weeklyBottomContainer,
        ]}
      >
        <ScrollView>
          {isDaily ? (
            <Timeline
              events={events}
              onHandleDetails={onHandleDetails}
              key={events.length}
            />
          ) : (
            <WeeklyTimeline
              events={events}
              onHandleDetails={onHandleDetails}
              selectedDate={selectedDate}
            />
          )}
        </ScrollView>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing={false}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
      >
        <View style={styles.sheetContent}>
          <Calendar
            onDayPress={(day: any) => {
              setSelectedDate(day.dateString);
              bottomSheetRef.current?.close();
            }}
            markedDates={{
              [selectedDate]: { selected: true, marked: true },
            }}
            theme={{
              selectedDayBackgroundColor: "#000",
              selectedDayTextColor: "#fff",
            }}
            onMonthChange={(date: any) => {
              setCurrentYearMonth({
                year: date.year,
                month: date.month
              });
            }}
          />
        </View>
      </BottomSheet>

      <Animated.View style={[styles.fab, animatedFabStyle]}>
        <TouchableOpacity onPress={handleFABPress}>
          <AntDesign name="plus" size={32} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <BottomSheet
        ref={bottomSheetRef2}
        snapPoints={snapPoints}
        handleStyle={{
          backgroundColor: selectedEvent?.category?.color || "#ffffff",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
        style={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
        handleIndicatorStyle={{
          backgroundColor: "#000000",
          width: 120,
          height: 4,
        }}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
        index={-1}
        onChange={(index) => {
          if (
            index === -1 &&
            selectedEvent &&
            tempMemo !== selectedEvent.memo
          ) {
            const updatedEvent = {
              ...selectedEvent,
              memo: tempMemo,
              startDate: new Date(selectedEvent.startDate),
              endDate: new Date(selectedEvent.endDate),
            };

            saveEvent(updatedEvent)
              .then(() => {
                setEvents((prevEvents) =>
                  prevEvents.map((event) =>
                    event.startDate === selectedEvent.startDate &&
                    event.endDate === selectedEvent.endDate &&
                    event.title === selectedEvent.title
                      ? updatedEvent
                      : event
                  )
                );
                setSelectedEvent(updatedEvent);
                fetchEvents(selectedDate);
              })
              .catch((error) => {
                console.error("Failed to save memo:", error);
              });
          }
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[
              styles.bottomSheetContent,
              { backgroundColor: selectedEvent?.category?.color || "#ffffff" },
            ]}
          >
            {selectedEvent?.startDate && selectedEvent?.endDate && (
              <View style={styles.timeContainer}>
                <Ionicons name="time" size={24} color="#000000" />
                <Text style={styles.timeText}>
                  {`${new Date(selectedEvent.startDate).getHours()}:${new Date(
                    selectedEvent.startDate
                  )
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")} ~ ${new Date(
                    selectedEvent.endDate
                  ).getHours()}:${new Date(selectedEvent.endDate)
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`}
                </Text>
              </View>
            )}
            <Text style={styles.eventTitle}>{selectedEvent?.title}</Text>
            <View style={styles.categoryContainer}>
              <Ionicons name="pricetag" size={24} color="#000000" />
              <Text style={styles.labelText}>
                카테고리 : {selectedEvent?.category?.name || ""}
              </Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={24} color="#000000" />
              <Text style={styles.labelText}>
                약속 장소 : {selectedEvent?.location || ""}
              </Text>
            </View>
            <View style={styles.memoContainer}>
              <View style={styles.memoHeader}>
                <Ionicons name="document-text" size={24} color="#000000" />
                <Text style={styles.memoLabel}>메모</Text>
              </View>
              <TextInput
                style={styles.memoInput}
                placeholder="메모를 입력하세요"
                value={tempMemo}
                multiline
                onChangeText={setTempMemo}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  topContainer: {
    flex: 3,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    justifyContent: "center",
  },
  middleContainer: {
    flex: 1,
    backgroundColor: "#ddd",
    margin: 10,
    borderRadius: 30,
  },
  bottomContainer: {
    flex: 6,
    backgroundColor: "#ffffff",
  },
  weeklyBottomContainer: {
    flex: 7,
    zIndex: -1,

    backgroundColor: "#ffffff",
    marginLeft: 10,
  },
  modeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  topRow: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  selectMonth: {
    fontSize: 20,
    fontFamily: "SpoqaHanSans-Bold",
  },
  listContainer: {
    alignItems: "center",
    justifyContent: "center",
    left: "2.2%",
  },
  itemContainer: {
    marginTop: 10,
    width: 70,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 35,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#b3b3b3",
  },
  selectedItemContainer: {
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#ffffff",
  },
  dateText: {
    fontSize: 24,
    fontWeight: "400",
    color: "#b3b3b3",
  },
  selectedDateText: {
    color: "#000000",
    fontWeight: "600",
  },
  divider: {
    width: "50%",
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#b3b3b3",
  },
  selectedDayText: {
    color: "#000000",
    fontWeight: "500",
  },
  sheetContent: {
    marginTop: "5%",
    flex: 1,
    padding: 20,
  },
  eventDetailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  calendarHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginVertical: 0,
  },
  calendarHeaderText: {
    fontSize: 24,
    fontFamily: "SpoqaHanSans-Bold",
    color: "#000",
  },
  todayButton: {
    marginLeft: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#000000",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  todayButtonText: {
    color: "#000000",
    fontFamily: "SpoqaHanSans-Bold",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#000",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  weekContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 0,
  },
  weekItemsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  timelineWidth: {
    width: 60,
    height: 130,
  },
  weekItem: {
    width: 42,
    height: 130,
    marginHorizontal: 0,
  },
  blackCapsule: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  monthLabel: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  selectedWeekItem: {
    backgroundColor: "#000",
  },
  weekDayText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  weekDateText: {
    fontSize: 16,
    color: "#000",
  },
  selectedWeekText: {
    color: "#fff",
  },
  todayText: {
    fontWeight: "bold",
  },
  weeklyTimelineContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  timeColumn: {
    width: 60,
    alignItems: "center",
  },
  timeLabelBlock: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  timeLabel: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  weeklyEventsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  dayColumn: {
    width: 42,
    height: HOUR_HEIGHT * 24,
  },
  eventItem: {
    position: "absolute",
    left: 2,
    right: 2,
    borderRadius: 100,
    padding: 2,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  eventContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  currentTimeLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: LINE_THICKNESS,
    backgroundColor: "#000000",
    zIndex: 2,
  },
  bottomSheetContent: {
    padding: 20,
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    fontFamily: "SpoqaHanSans-Light",
    marginLeft: 5,
    color: "#000000",
  },
  eventTitle: {
    fontSize: 32,
    fontFamily: "SpoqaHanSans-Bold",
    marginTop: 10,
    color: "#000000",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  labelText: {
    fontSize: 26,
    fontFamily: "SpoqaHanSans-Light",
    marginLeft: 5,
    color: "#000000",
  },
  memoContainer: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 30,
    minHeight: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  memoLabel: {
    fontSize: 22,
    fontFamily: "SpoqaHanSans-Light",
    marginLeft: 5,
    color: "#000000",
  },
  memoInput: {
    fontSize: 22,
    fontFamily: "SpoqaHanSans-Light",
    marginLeft: 10,
    flex: 1,
    marginTop: 10,
    color: "#000000",
  },
  carouselContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
    
});
