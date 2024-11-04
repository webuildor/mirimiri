import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { EventItem } from "@/types/event";
import { Ionicons } from "@expo/vector-icons";

const HOUR_HEIGHT = 60;
const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
const CIRCLE_DIAMETER = 12;
const LINE_THICKNESS = 2;

interface TimelineProps {
  events: EventItem[];
  
  onHandleDetails: (event : EventItem) => void;
}

const Timeline: React.FC<TimelineProps> = ({ events, onHandleDetails}) => {
  const [currentTimeOffset, setCurrentTimeOffset] = useState(0);

  const calculateCurrentTimeOffset = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes * MINUTE_HEIGHT;
  };

  useEffect(() => {
    setCurrentTimeOffset(calculateCurrentTimeOffset());

    const interval = setInterval(() => {
      setCurrentTimeOffset(calculateCurrentTimeOffset());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const renderTimeLabels = () => {
    return Array.from({ length: 24 }, (_, hour) => {
      const timeLabel = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      return (
        <View
          key={timeLabel}
          style={[styles.timeLabelBlock, { height: HOUR_HEIGHT }]}
        >
          <Text style={styles.timeLabel}>{timeLabel}</Text>
        </View>
      );
    });
  };

  const renderHourLines = () => {
    return Array.from({ length: 24 }, (_, index) => (
      <View
        key={`line-${index}`}
        style={{ top: index * HOUR_HEIGHT }}
      />
    ));
  };

  const renderEvents = () => {
    return events.map((event, index) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
      const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
      const topOffset = startMinutes * MINUTE_HEIGHT;
      const eventHeight = (endMinutes - startMinutes) * MINUTE_HEIGHT;

      return (
        <TouchableOpacity key={index} onPress={() => onHandleDetails(event)}>
          <View
            style={[
              styles.eventItem,
              {
                top: topOffset,
                height: eventHeight,
                backgroundColor: event.category?.color || '#e0e0e0',
              },
            ]}
          >
            <Text style={styles.eventText}>{event.title}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="location"  size={16}/>
              <Text style={styles.eventLocation}>{event.location}</Text>
              
            </View>
            <Text style={styles.eventTimes}>
              {`${new Date(event.startDate).getHours()}:${new Date(
                event.startDate
              )
                .getMinutes()
                .toString()
                .padStart(2, "0")} ~ ${new Date(
                event.endDate
              ).getHours()}:${new Date(event.endDate)
                .getMinutes()
                .toString()
                .padStart(2, "0")}`}
            </Text>
            <Text style={styles.eventMemo}
              numberOfLines={1}
              ellipsizeMode="tail"
            >메모 : {event.memo}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  const handleUpdateEvent = (event: EventItem) => {
    console.log("Updating event:", event);
  };

  const handleDeleteEvent = (startDate: string) => {
    console.log("Deleting event with start date:", startDate);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.timeline}>
        <View style={styles.timeColumn}>{renderTimeLabels()}</View>
        <View style={styles.eventColumn}>
          {renderHourLines()}
          {renderEvents()}
          <View
            style={[
              styles.currentTimeLine,
              {
                top: currentTimeOffset - LINE_THICKNESS / 2,
              },
            ]}
          />
          <View
            style={[
              styles.currentTimeCircle,
              {
                top: currentTimeOffset - CIRCLE_DIAMETER / 2,
              },
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  timeline: {
    flexDirection: "row",
    flex: 1,
  },
  timeColumn: {
    width: 80,
  },
  timeLabelBlock: {
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 14,
    color: "#888",
  },
  eventColumn: {
    flex: 1,
    position: "relative",
  },
  eventItem: {
    position: "absolute",
    left: 10,
    right: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
  eventText: {
    fontSize: 24,
    color: "#000000",
    fontFamily: "SpoqaHanSans-Bold",
  },
  currentTimeLine: {
    position: "absolute",
    height: LINE_THICKNESS,
    width: "100%",
    backgroundColor: "#000000",
    zIndex: 2,
  },
  currentTimeCircle: {
    position: "absolute",
    left: -CIRCLE_DIAMETER / 2,
    width: CIRCLE_DIAMETER,
    height: CIRCLE_DIAMETER,
    backgroundColor: "#000000",
    borderRadius: CIRCLE_DIAMETER / 2,
    zIndex: 3,
  },
  buttonText: {
    fontSize: 14,
    color: "#007bff",
    marginLeft: 5,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  eventTimes: {
    fontSize: 14,
    fontFamily: "SpoqaHanSans-Regular",
  },
  eventLocation: {
    fontSize: 16,
    fontFamily: "SpoqaHanSans-Medium",
  },
  eventMemo: {
    fontSize: 16,
    fontFamily: "SpoqaHanSans-Light",
    color: "#000000",
  },
});

export default Timeline;
