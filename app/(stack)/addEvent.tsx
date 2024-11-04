import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import RepeatOptionSelector from "@/components/RepeatOptionSelector";
import { EventItem } from "@/types/event";

type CategoryIcon = {
  readonly name: string;
  readonly icon: string;
};

type CategoryBottomSheetProps = {
  selectedColor: string;
  selectedIcon: string;
  setSelectedColor: (color: string) => void;
  setSelectedIcon: (icon: string) => void;
  setSelectedCategory: (name: string) => void;
  categoryColors: readonly string[];
  categoryIcons: readonly CategoryIcon[];
  currentColorPage: number;
  currentIconPage: number;
  setCurrentColorPage: (page: number) => void;
  setCurrentIconPage: (page: number) => void;
};

const CategoryBottomSheet = ({ 
  selectedColor, 
  selectedIcon, 
  setSelectedColor, 
  setSelectedIcon, 
  setSelectedCategory,
  categoryColors,
  categoryIcons,
  currentColorPage,
  currentIconPage,
  setCurrentColorPage,
  setCurrentIconPage
}: CategoryBottomSheetProps) => {
  const selectedIconName = categoryIcons.find(item => item.icon === selectedIcon)?.name || '카테고리 명';

  
  const colorPageTitles = ['파스텔톤', '비비드톤', '딥톤', '뮤트톤', '그레이시'];
  const iconPageTitles = ['학업', '업무', '건강/운동', '취미/여가', '일상/관계'];

  return (
    <View style={styles.bottomSheetContent}>
      <View style={[
        styles.previewCircle,
        { backgroundColor: selectedColor || '#f5f5f5' }
      ]}>
        {selectedIcon && (
          <Ionicons 
            name={selectedIcon as keyof typeof Ionicons.glyphMap} 
            size={40} 
            color="#000000"
          />
        )}
      </View>
      
      <Text style={styles.categoryTitle}>{selectedIconName}</Text>

      <View style={styles.selectionContainer}>
        <View style={styles.colorBox}>
          <View style={styles.arrowContainer}>
            <TouchableOpacity 
              onPress={() => setCurrentColorPage(Math.max(0, currentColorPage - 1))}
              disabled={currentColorPage === 0}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={currentColorPage === 0 ? "#ccc" : "#000"} 
              />
            </TouchableOpacity>
            <View style={styles.pageTitleContainer}>
              <Text style={styles.pageTitle}>{colorPageTitles[currentColorPage]}</Text>
              <Text style={styles.pageNumber}>{currentColorPage + 1}/5</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setCurrentColorPage(Math.min(4, currentColorPage + 1))}
              disabled={currentColorPage === 4}
            >
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={currentColorPage === 4 ? "#ccc" : "#000"} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.colorGrid}>
            {categoryColors.slice(currentColorPage * 9, (currentColorPage + 1) * 9).map((color, index) => (
              <TouchableOpacity
                key={currentColorPage * 9 + index}
                style={[
                  styles.colorItem,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorItem
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        <View style={styles.iconBox}>
          <View style={styles.arrowContainer}>
            <TouchableOpacity 
              onPress={() => setCurrentIconPage(Math.max(0, currentIconPage - 1))}
              disabled={currentIconPage === 0}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={currentIconPage === 0 ? "#ccc" : "#000"} 
              />
            </TouchableOpacity>
            <View style={styles.pageTitleContainer}>
              <Text style={styles.pageTitle}>{iconPageTitles[currentIconPage]}</Text>
              <Text style={styles.pageNumber}>{currentIconPage + 1}/5</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setCurrentIconPage(Math.min(4, currentIconPage + 1))}
              disabled={currentIconPage === 4}
            >
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={currentIconPage === 4 ? "#ccc" : "#000"} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.iconGrid}>
            {categoryIcons.slice(currentIconPage * 9, (currentIconPage + 1) * 9).map((item, index) => (
              <TouchableOpacity
                key={currentIconPage * 9 + index}
                style={[
                  styles.iconItem,
                  selectedIcon === item.icon && styles.selectedIconItem
                ]}
                onPress={() => {
                  setSelectedIcon(item.icon);
                  setSelectedCategory(item.name);
                }}
              >
                <Ionicons 
                  name={item.icon as keyof typeof Ionicons.glyphMap} 
                  size={20} 
                  color="#000000"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default function AddEvent() {
  const { date } = useLocalSearchParams();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [alarmValue, setAlarmValue] = useState("알람 설정");
  const [location, setLocation] = useState("");
  const [memo, setMemo] = useState("");
  const [title, setTitle] = useState("");
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const categorySheetRef = useRef<BottomSheetModal>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [tempData, setTempData] = useState<{
    option: string;
    days: string[];
    dates: string[];
  } | null>(null);
  const [currentColorPage, setCurrentColorPage] = useState(0);
  const [currentIconPage, setCurrentIconPage] = useState(0);

  const handleRepeatData = (data: {
    option: string;
    days: string[];
    dates: string[];
  }) => {
    setTempData(data);
  };

  const handleStartConfirm = (time: any) => {
    setStartTime(formatTime(time));
    setStartPickerVisible(false);
  };

  const handleEndConfirm = (time: any) => {
    setEndTime(formatTime(time));
    setEndPickerVisible(false);
  };

  const formatTime = (date: any) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleComplete = () => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date(date as string);
    startDate.setHours(hours, minutes);

    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const endDate = new Date(date as string);
    endDate.setHours(endHours, endMinutes);

    const eventData: EventItem = {
      title: title,
      startDate: startDate,
      endDate: endDate,
      location: location || undefined,
      memo: memo || undefined,
      category: {
        name: selectedCategory,
        color: selectedColor,
        icon: selectedIcon
      }
    };

    
    if (tempData && tempData.option !== "매일") {
      eventData.repeatOption = {
        type: tempData.option as "매일" | "매주" | "매월",
        days: tempData.option === "매주" ? tempData.days : undefined,
        dates: tempData.option === "매월" 
          ? tempData.dates.map(date => parseInt(date.split('-')[2]))
          : undefined
      };
    }

    
    router.push({
      pathname: "/(tabs)/home",
      params: { newEvent: JSON.stringify(eventData) }
    });
  };

  const snapPoints = useMemo(() => ["50%"], []);
  const categorySnapPoints = useMemo(() => ["60%"], []);

  
  const categoryColors = [
    
    '#FFB5B5', '#FFD1B5', '#FFEBB5', '#B5FFD1', '#B5FFEB', '#B5D1FF', '#D1B5FF', '#FFB5EB', '#FFB5D1',
    
    
    '#FF5252', '#FF7F52', '#FFB852', '#52FF7F', '#52FFEB', '#527FFF', '#7F52FF', '#FF52EB', '#FF5284',
    
    
    '#8B0000', '#8B4000', '#8B8B00', '#008B00', '#008B8B', '#00008B', '#4B008B', '#8B008B', '#8B0040',
    
    
    '#C48888', '#C4A088', '#C4C488', '#88C488', '#88C4C4', '#8888C4', '#A088C4', '#C488C4', '#C48898',
    
    
    '#B5A5A5', '#B5ADA5', '#B5B5A5', '#A5B5A5', '#A5B5B5', '#A5A5B5', '#ADA5B5', '#B5A5B5', '#B5A5AD'
  ] as const;

  const categoryIcons = [
    
    { name: '수업', icon: 'school' },
    { name: '과제', icon: 'document-text' },
    { name: '시험', icon: 'pencil' },
    { name: '발표', icon: 'mic' },
    { name: '스터디', icon: 'book' },
    { name: '강의', icon: 'desktop' },
    { name: '연구', icon: 'flask' },
    { name: '논문', icon: 'newspaper' },
    { name: '프로젝트', icon: 'construct' },

    
    { name: '회의', icon: 'people' },
    { name: '미팅', icon: 'briefcase' },
    { name: '출장', icon: 'airplane' },
    { name: '보고', icon: 'document' },
    { name: '마감', icon: 'alarm' },
    { name: '전화', icon: 'call' },
    { name: '이메일', icon: 'mail' },
    { name: '업무', icon: 'laptop' },
    { name: '회식', icon: 'restaurant' },

    
    { name: '운동', icon: 'fitness' },
    { name: '요가', icon: 'body' },
    { name: '필라테스', icon: 'barbell' },
    { name: '달리기', icon: 'walk' },
    { name: '수영', icon: 'water' },
    { name: '병원', icon: 'medical' },
    { name: '약속', icon: 'pulse' },
    { name: '식단', icon: 'nutrition' },
    { name: '휴식', icon: 'bed' },

    
    { name: '영화', icon: 'film' },
    { name: '음악', icon: 'musical-notes' },
    { name: '게임', icon: 'game-controller' },
    { name: '독서', icon: 'book-outline' },
    { name: '그림', icon: 'brush' },
    { name: '사진', icon: 'camera' },
    { name: '여행', icon: 'airplane-outline' },
    { name: '쇼핑', icon: 'cart' },
    { name: '요리', icon: 'restaurant-outline' },

    
    { name: '약속', icon: 'cafe' },
    { name: '데이트', icon: 'heart' },
    { name: '가족', icon: 'home' },
    { name: '친구', icon: 'people-circle' },
    { name: '동아리', icon: 'people-outline' },
    { name: '청소', icon: 'trash' },
    { name: '장보기', icon: 'basket' },
    { name: '일기', icon: 'journal' },
    { name: '기타', icon: 'ellipsis-horizontal' }
  ] as const;

  const colors: string[] = [...categoryColors];

  
  const currentColors = categoryColors.slice(currentColorPage * 9, (currentColorPage + 1) * 9);
  const currentIcons = categoryIcons.slice(currentIconPage * 9, (currentIconPage + 1) * 9);

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.dateField}>
            <Text style={styles.dateTextStyle}>
              {date} {"\n"}
              일정 추가
            </Text>

            <View style={styles.eventTitleField}>
              <View style={styles.titleBox}>
                <Text style={styles.eventTitle}>제목</Text>
              </View>
              <View
                style={[
                  styles.titleInputBox,
                  focusedField === "title" && styles.focusedInputBox,
                ]}
              >
                <TextInput
                  style={styles.titleInput}
                  placeholder="일정 제목을 입력해주세요"
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField("")}
                  onChangeText={setTitle}
                  value={title}
                />
              </View>
            </View>

            <View style={styles.hr}></View>

            <View style={styles.categoryField}>
              <View style={styles.titleBox}>
                <Text style={styles.eventTitle}>카테고리</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.titleInputBox,
                  focusedField === "category" && styles.focusedInputBox,
                  selectedColor ? { backgroundColor: selectedColor } : null
                ]}
                onPress={() => {
                  categorySheetRef.current?.present();
                  setFocusedField("category");
                }}
              >
                {selectedIcon ? (
                  <View style={styles.categoryPreview}>
                    <Ionicons 
                      name={selectedIcon as keyof typeof Ionicons.glyphMap} 
                      size={24} 
                      color="#000000"
                    />
                    <Text style={styles.categoryText}>
                      {selectedCategory}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>카테고리를 선택해주세요</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.hr}></View>

            <TouchableOpacity
              style={[
                styles.startTimeField,
                focusedField === "startTime" && styles.focusedInputBox,
              ]}
              onPress={() => {
                setStartPickerVisible(true);
                setFocusedField("startTime");
              }}
            >
              <Text style={styles.eventTitle}>시작 시간</Text>
              <View
                style={[
                  styles.titleInputBox,
                  focusedField === "startTime" && styles.focusedInputBox,
                ]}
              >
                <Text style={styles.timeText}>
                  {startTime || "시작 시간을 선택해주세요."}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.startTimeField,
                { marginTop: 20 },
                focusedField === "endTime" && styles.focusedInputBox,
              ]}
              onPress={() => {
                setEndPickerVisible(true);
                setFocusedField("endTime");
              }}
            >
              <Text style={styles.eventTitle}>종료 시간</Text>
              <View
                style={[
                  styles.titleInputBox,
                  focusedField === "endTime" && styles.focusedInputBox,
                ]}
              >
                <Text style={styles.timeText}>
                  {endTime || "종료 시간을 선택해세요."}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.hr}></View>

            <View style={styles.optionalContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>선택사항</Text>
              </View>

              <View style={styles.alarmOption}>
                <Ionicons name="alarm" size={48} />
                <TouchableOpacity
                  style={styles.alarmField}
                  onPress={() => bottomSheetRef.current?.present()}
                >
                  <Text style={styles.alarmInput}>{alarmValue}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.locationOption}>
                <Ionicons name="location" size={48} />
                <View style={styles.locationField}>
                  <TextInput
                    style={styles.locationInput}
                    placeholder="장소를 입력해주세요"
                    placeholderTextColor="#bcbcbc"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
              </View>

              <View style={styles.memoContainer}>
                <TextInput
                  style={styles.memoInput}
                  placeholder="메모를 입력해주세요"
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#bcbcbc"
                  value={memo}
                  onChangeText={setMemo}
                />
              </View>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isStartPickerVisible}
            mode="time"
            is24Hour={true}
            minuteInterval={5}
            onConfirm={handleStartConfirm}
            onCancel={() => {
              setStartPickerVisible(false);
              setFocusedField("");
            }}
          />

          <DateTimePickerModal
            isVisible={isEndPickerVisible}
            mode="time"
            is24Hour={true}
            minuteInterval={5}
            onConfirm={handleEndConfirm}
            onCancel={() => {
              setEndPickerVisible(false);
              setFocusedField("");
            }}
          />

          <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            enableDynamicSizing={false}
            backdropComponent={props => (
              <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
              />
            )}
            onChange={(index) => {
              if (index === -1 && tempData) {
                if (tempData.option === "매주" && tempData.days.length > 0) {
                  setAlarmValue(`매주 ${tempData.days.join(", ")}`);
                } else if (tempData.option === "매월" && tempData.dates.length > 0) {
                  const days = tempData.dates.map(date => parseInt(date.split('-')[2]));
                  setAlarmValue(`매월 ${days.join(", ")}일`);
                } else {
                  setAlarmValue(tempData.option);
                }
              }
            }}
          >
            <View style={styles.sheetContent}>
              <RepeatOptionSelector onComplete={handleRepeatData} />
            </View>
          </BottomSheetModal>

          <BottomSheetModal
            ref={categorySheetRef}
            index={0}
            snapPoints={categorySnapPoints}
            enablePanDownToClose
            enableDynamicSizing={false}
            backdropComponent={props => (
              <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
              />
            )}
          >
            <CategoryBottomSheet
              selectedColor={selectedColor}
              selectedIcon={selectedIcon}
              setSelectedColor={setSelectedColor}
              setSelectedIcon={setSelectedIcon}
              setSelectedCategory={setSelectedCategory}
              categoryColors={colors}
              categoryIcons={categoryIcons}
              currentColorPage={currentColorPage}
              currentIconPage={currentIconPage}
              setCurrentColorPage={setCurrentColorPage}
              setCurrentIconPage={setCurrentIconPage}
            />
          </BottomSheetModal>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleComplete}>
            <Text style={styles.buttonText}>완료</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dateField: {
    marginTop: 80,
    padding: 40,
  },
  dateTextStyle: {
    fontSize: 32,
    fontFamily: "SpoqaHanSans-Light",
  },
  eventTitleField: {
    marginTop: 80,
    flexDirection: "row",
    width: "100%",
    marginBottom: 30,
  },
  titleBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: "SpoqaHanSans-Bold",
    textAlign: "center",
  },
  titleInputBox: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    borderColor: "#cccccc",
  },
  focusedInputBox: {
    borderColor: "#000000", 
  },
  titleInput: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
  },
  hr: {
    width: "100%",
    height: 2,
    backgroundColor: "#eeeeee",
    marginVertical: 30,
  },
  startTimeField: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  timeText: {
    fontSize: 18,
    fontFamily: "SpoqaHanSans-Regular",
    color: "#000",
    textAlign: "center",
  },
  optionalContainer: {
    width: "100%",
    height: 400,
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 60,
    position: 'relative',
  },
  labelContainer: {
    position: "absolute",
    top: -20,
    left: -20,
    width: 150,
    height: 40,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "SpoqaHanSans-Bold",
  },
  alarmOption: {
    marginTop: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  alarmField: {
    flex: 1,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  locationOption: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  locationField: {
    flex: 1,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  locationInput: {
    flex: 1,
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "SpoqaHanSans-Light",
  },
  sheetContent: {
    flex: 1,
    marginTop: 30,
    alignItems: "center",
  },
  sheetText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    width: "100%",
    height: 80,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    fontFamily: "SpoqaHanSans-Bold",
    color: "#ffffff",
  },
  alarmInput: {
    flex: 1,
    width: "100%",
    textAlign: "center", 
    fontSize: 16,
    fontFamily: "SpoqaHanSans-Light", 
    marginTop: 15,
    color: "#bcbcbc", 
  },
  memoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  memoInput: {
    height: 140,
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    fontFamily: "SpoqaHanSans-Light",
    textAlignVertical: "top",
    color: "#000",
    backgroundColor: "#f5f5f5",  
  },
  categoryField: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  categoryPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',  
    gap: 8,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'SpoqaHanSans-Medium',
    color: '#000000',  
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'SpoqaHanSans-Regular',
    color: '#bcbcbc',
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  previewCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 24,
    fontFamily: 'SpoqaHanSans-Bold',
    marginBottom: 40,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 20,
  },
  colorBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  colorItem: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  iconItem: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedColorItem: {
    borderWidth: 2,
    borderColor: '#000',
  },
  selectedIconItem: {
    backgroundColor: '#f5f5f5',
  },
  pageText: {
    fontSize: 12,
    fontFamily: 'SpoqaHanSans-Medium',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 5,
  },
  pageTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pageTitle: {
    fontSize: 12,
    fontFamily: 'SpoqaHanSans-Bold',
    color: '#000000',
    marginBottom: 2,
  },
  pageNumber: {
    fontSize: 10,
    fontFamily: 'SpoqaHanSans-Medium',
    color: '#666666',
  },
});
