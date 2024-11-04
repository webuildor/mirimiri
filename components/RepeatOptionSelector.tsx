import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const screenWidth = Dimensions.get("window").width;

interface RepeatOptionSelectorProps {
  onComplete: (data: { option: string; days: string[]; dates: string[] }) => void;
}

export default function RepeatOptionSelector({ onComplete }: RepeatOptionSelectorProps) {
  const [selectedOption, setSelectedOption] = useState("매일");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<Record<string, any>>({});

  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const toggleDate = (date: string) => {
    setSelectedDates((prevDates) => {
      const newDates = { ...prevDates };
      if (newDates[date]) {
        delete newDates[date];
      } else {
        newDates[date] = { selected: true, marked: true, selectedColor: "#000" };
      }
      return newDates;
    });
  };

  
  useEffect(() => {
    onComplete({
      option: selectedOption,
      days: selectedDays,
      dates: Object.keys(selectedDates)
    });
  }, [selectedOption, selectedDays, selectedDates]);

  const renderMonthlyOptions = () => (
    <View style={styles.calendarWrapper}>
      <Calendar
        markedDates={selectedDates}
        onDayPress={(day: any) => toggleDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: "#000",
          selectedDayTextColor: "#fff",
          todayTextColor: "#000",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          arrowColor: "#000",
          monthTextColor: "#000",
        }}
      />
    </View>
  );

  const renderWeeklyOptions = () => (
    <View style={styles.weeklyContainer}>
      {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
        <TouchableOpacity
          key={day}
          style={[
            styles.dayBox,
            selectedDays.includes(day) && styles.selectedDayBox,
          ]}
          onPress={() => toggleDay(day)}
        >
          <Text
            style={[
              styles.dayText,
              selectedDays.includes(day) && styles.selectedDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (selectedOption) {
      case "매일":
        return <Text style={styles.contentText}>매일 반복됩니다.</Text>;
      case "매주":
        return renderWeeklyOptions();
      case "매월":
        return renderMonthlyOptions();
      default:
        return null;
    }
  };

  return (
    <>
      <View style={styles.container}>
        {["매일", "매주", "매월"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedOption === option && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect(option)}
          >
            {selectedOption === option && (
              <View style={styles.iconWrapper}>
                <Ionicons name="checkmark" size={18} color="#fff" />
              </View>
            )}
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentWrapper}>{renderContent()}</View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 60,
    flexDirection: "row",
    borderRadius: 30,
    backgroundColor: "#000",
    padding: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingVertical: 12,
  },
  selectedOption: {
    backgroundColor: "#fff",
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  optionText: {
    color: "#fff",
    fontFamily: "SpoqaHanSans-Regular",
    fontSize: 24,
    textAlign: "center",
  },
  selectedOptionText: {
    color: "#000",
    fontFamily: "SpoqaHanSans-Bold",
  },
  contentWrapper: {
    marginTop: 20,
    flex: 1,
    width: "90%",
  },
  contentText: {
    fontSize: 16,
    fontFamily: "SpoqaHanSans-Regular",
    color: "#000",
    textAlign: "center",
  },
  weeklyContainer: {
    left: 12.5,
    justifyContent: 'flex-start',
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  dayBox: {
    width: 65,
    height: 65,
    margin: 5,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  selectedDayBox: {
    backgroundColor: "#000",
  },
  dayText: {
    fontFamily: "SpoqaHanSans-Regular",
    fontSize: 14,
    color: "#000",
  },
  selectedDayText: {
    color: "#fff",
    fontFamily: "SpoqaHanSans-Bold",
  },
  calendarWrapper: {
    flex: 1,
  },
});
