import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь','Февраль','Март','Апрель','Май','Июнь',
    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
  ],
  monthNamesShort: [
    'Янв','Фев','Мар','Апр','Май','Июн',
    'Июл','Авг','Сен','Окт','Ноя','Дек'
  ],
  dayNames: [
    'Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'
  ],
  dayNamesShort: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
  today: 'Сегодня'
};

LocaleConfig.defaultLocale = 'ru';


export default function DatePickerSimple({ date, onChange }: any) {
  const [open, setOpen] = useState(false);

  const prev = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    onChange(d);
  };

  const next = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    onChange(d);
  };

  const toggle = () => setOpen(!open);

  return (
    <View>
      {/* Верхняя панель */}
      <View style={styles.container}>
        <TouchableOpacity onPress={prev} style={styles.button}>
          <Text style={styles.buttonText}>&lt;</Text>
        </TouchableOpacity>

        <Text style={styles.dateText}>
          {`${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`}
        </Text>

        <TouchableOpacity onPress={next} style={styles.button}>
          <Text style={styles.buttonText}>&gt;</Text>
        </TouchableOpacity>
      </View>
        {/* Кнопка открытия календаря */}
        <TouchableOpacity onPress={toggle} style={styles.calendarToggle}>
          <Text style={styles.calendarToggleText}>
            {open ? 'Скрыть календарь' : 'Развернуть календарь'}
          </Text>
        </TouchableOpacity>
      {/* Календарь */}
      {open && (
<<<<<<< HEAD
        <View style={styles.calendarWrapper}>
=======
        <View style={{ marginBottom: 16 }}>
>>>>>>> 9f49f2f (Календарь)
          <Calendar
            onDayPress={(day) => {
              onChange(new Date(day.dateString));
              setOpen(false);
            }}
            markedDates={{
              [date.toISOString().split('T')[0]]: { selected: true },
            }}
            theme={{
              calendarBackground: '#1F2937',
              dayTextColor: '#fff',
              monthTextColor: '#fff',
              selectedDayBackgroundColor: '#2563EB',
              selectedDayTextColor: '#fff',
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  calendarToggle: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
<<<<<<< HEAD
  calendarWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
=======
>>>>>>> 9f49f2f (Календарь)
  buttonText: { color: '#FFFFFF' },
  dateText: { color: '#FFFFFF', fontSize: 16, flex: 1, textAlign: 'center' },
  calendarToggleText: { color: '#FFFFFF' },
});
