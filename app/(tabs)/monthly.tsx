import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
  BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar, CalendarList, DateData } from "react-native-calendars";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { loadEventsForDate } from "@/hooks/storage";
import Timeline from "@/components/Timeline";
import { EventItem } from "@/types/event";

interface MarkedDates {
  [date: string]: {
    periods?: {
      startingDay: boolean;
      endingDay: boolean;
      color: string;
    }[];
    selected?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
  }
}

export default function Monthly() {
  const [isAlternateView, setIsAlternateView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const currentMonth = new Date().getMonth() + 1;
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-500);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<EventItem[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    loadMonthEvents(`${year}-${month}`);
  }, []);

  const toggleView = () => {
    setIsAlternateView(!isAlternateView);
    translateY.value = isAlternateView ? -1000 : 500;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withTiming(translateY.value, { duration: 500 }) },
      ],
    };
  });

  const handleDayPress = async (day: DateData) => {
    setSelectedDate(day.dateString);
    setIsBottomSheetVisible(true);
    const events = await loadEventsForDate(day.dateString);
    setSelectedDateEvents(events);
    bottomSheetRef.current?.present();
  };

  const handleDismiss = () => {
    setIsBottomSheetVisible(false);
  };

  const handleEventDetails = (event: EventItem) => {
    console.log("Selected event:", event);
  };

  const loadMonthEvents = async (month: string) => {
    const [year, monthStr] = month.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(monthStr), 0).getDate();
    
    const newMarkedDates: MarkedDates = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${monthStr}-${day.toString().padStart(2, '0')}`;
      const events = await loadEventsForDate(date);
      if (events.length > 0) {
        newMarkedDates[date] = {
          periods: events.map(event => ({
            startingDay: true,
            endingDay: true,
            color: event.category?.color || '#000'
          })),
          ...(date === selectedDate && {
            selected: true,
            selectedColor: "#000",
            selectedTextColor: "#fff",
          }),
        };
      } else if (date === selectedDate) {
        newMarkedDates[date] = {
          selected: true,
          selectedColor: "#000",
          selectedTextColor: "#fff"
        };
      }
    }

    setMarkedDates(newMarkedDates);
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View>
            <TouchableOpacity
              onPress={toggleView}
              style={{
                marginTop: insets.top,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 50,
              }}
            >
              <Text
                style={{ fontSize: 24, fontFamily: "SpoqaHanSans-Bold" }}
              >
                {currentMonth}월
              </Text>
              <Ionicons
                name="chevron-down"
                size={24}
                color="000"
                marginLeft={10}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Calendar
            style={styles.calendar}
            onDayPress={handleDayPress}
            renderHeader={() => null}
            hideArrows={true}
            markingType="multi-period"
            markedDates={markedDates}
            onMonthChange={(month: { year: number; month: number }) => {
              loadMonthEvents(`${month.year}-${(month.month).toString().padStart(2, '0')}`);
            }}
            theme={{
              
            }}
          />
        </View>

        <Animated.View style={[styles.calendarListContainer, animatedStyle]}>
          <CalendarList
            onDayPress={handleDayPress}
            pastScrollRange={12}
            futureScrollRange={12}
            scrollEnabled={true}
            showScrollIndicator={true}
          />
        </Animated.View>

        {isBottomSheetVisible && (
          <Pressable 
            style={styles.backdrop}
            onPress={() => bottomSheetRef.current?.dismiss()}
          />
        )}

        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          enableDynamicSizing={false}
          backgroundStyle={{ backgroundColor: 'white' }}
          onDismiss={handleDismiss}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.dateTitle}>{selectedDate}</Text>
            {selectedDateEvents.length > 0 ? (
              <Timeline 
                events={selectedDateEvents} 
                onHandleDetails={handleEventDetails}
              />
            ) : (
              <Text style={styles.noEventText}>등록된 일정이 없습니다.</Text>
            )}
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  bottomContainer: {
    flex: 3,
    backgroundColor: "#ffffff",
    zIndex: -2,
  },
  calendar: {
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    
  },
  calendarListContainer: {
    position: "absolute",
    top: -500,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "#fff",
    zIndex: -1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  dateTitle: {
    fontSize: 20,
    fontFamily: "SpoqaHanSans-Bold",
    marginBottom: 20,
  },
  noEventText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
