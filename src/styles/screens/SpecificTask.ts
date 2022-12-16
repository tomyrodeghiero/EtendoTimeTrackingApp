import {StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../theme';

export const stylesSpecificTask = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: '#f5f5f9',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
  backButtonContainer: {
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: '#eff1f7',
    borderWidth: 1,
    borderColor: '#d3d6e1',
    justifyContent: 'center',
    marginVertical: 25,
    alignItems: 'center',
  },
  backButtonImage: {
    width: 20,
    resizeMode: 'contain',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleSectionText: {
    color: COLORS.primary,
    fontFamily: 'Inter-ExtraBold',
    fontSize: 22,
    width: '70%',
  },
  keyTaskSection: {
    flexDirection: 'row',
  },
  keyTaskImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  keyTaskText: {
    marginLeft: 10,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary,
  },
  taskDescriptionContainer: {
    minHeight: '20%',
    maxHeight: '45%',
    backgroundColor: '#7182ff',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  taskDescriptionTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskDescriptionTitleLeftSection: {
    flexDirection: 'row',
    width: '55%',
    alignItems: 'center',
  },
  calendarImage: {
    width: 30,
    resizeMode: 'contain',
    height: 30,
    tintColor: COLORS.white,
  },
  taskDescriptionTitleLeft: {
    marginTop: 7,
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: COLORS.white,
  },
  sectionTimeWorkedTask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  timeImage: {
    width: 22,
    marginRight: 7,
    resizeMode: 'contain',
    height: 22,
    tintColor: COLORS.white,
  },
  textTimeWorkedTask: {
    fontFamily: 'Inter-Medium',
    color: COLORS.white,
  },
  inputTaskDescription: {
    fontFamily: 'Inter-Regular',
    color: COLORS.white,
    fontSize: SIZES.font,
    lineHeight: 22,
  },
  taskEstimatedTimeSection: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#e5e5e5',
    borderWidth: 1,
  },
  taskEstimatedTimeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskEstimatedTitleSection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  taskEstimatedCalendarImage: {
    width: 25,
    resizeMode: 'contain',
    height: 25,
    tintColor: COLORS.primary,
  },
  taskEstimatedTitleText: {
    textAlignVertical: 'center',
    marginLeft: 10,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary,
  },
  taskEstimatedDescriptionText: {
    fontFamily: 'Inter-Regular',
    color: COLORS.primary,
    fontSize: SIZES.font,
  },
});
