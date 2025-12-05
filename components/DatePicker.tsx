import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  date: Date;
  onSelect: (date: Date) => void;
}

export function DatePicker({ visible, onClose, date, onSelect }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(date);
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentYear] = useState(date.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    onSelect(newDate);
  };

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <Pressable
          key={day}
          style={[
            styles.dayCell,
            isSelected(day) && styles.selectedDay,
            isToday(day) && !isSelected(day) && styles.todayDay,
          ]}
          onPress={() => handleDateSelect(day)}
        >
          <Text
            style={[
              styles.dayText,
              isSelected(day) && styles.selectedDayText,
              isToday(day) && !isSelected(day) && styles.todayDayText,
            ]}
          >
            {day}
          </Text>
        </Pressable>,
      );
    }
    return days;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Pressable onPress={() => navigateMonth('prev')}>
              <Text style={styles.navButton}>‹</Text>
            </Pressable>
            <View style={styles.monthYearContainer}>
              <Text style={styles.monthYear}>
                {monthNames[currentMonth]} {currentYear}
              </Text>
            </View>
            <Pressable onPress={() => navigateMonth('next')}>
              <Text style={styles.navButton}>›</Text>
            </Pressable>
          </View>

          <View style={styles.dayNamesContainer}>
            {dayNames.map(day => (
              <Text key={day} style={styles.dayName}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    width: '90%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
    paddingHorizontal: 12,
  },
  monthYearContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthYear: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayName: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  selectedDay: {
    backgroundColor: '#6b46c1',
    borderRadius: 20,
  },
  todayDay: {
    borderWidth: 1,
    borderColor: '#6b46c1',
    borderRadius: 20,
  },
  dayText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  todayDayText: {
    color: '#6b46c1',
  },
});
