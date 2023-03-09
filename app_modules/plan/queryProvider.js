const __constants = require('../../config/constants')
const getListOfPlan = () => {
  return `
  select plan_id as planId, plan_name as planName, see_voice as seeVoice, see_update_profile as seeUpdateProfile, add_voice as addVoice, see_news as seeNews, see_event as seeEvent, add_news as addNews,
  add_event as addEvent, see_achievement as seeAchievement, see_details as seeDetails, spend_achievement as spendAchievement, apply_celebrity as applyCelebrity
  from plan
  where plan_id != ${__constants.SUBSCRIPTION.free_plan} and is_active=1; 
  `
}

const getPlanListById = () => {
  return `
  select plan_id as planId, plan_name as planName, see_voice as seeVoice, see_update_profile as seeUpdateProfile, add_voice as addVoice, see_news as seeNews, see_event as seeEvent, add_news as addNews,
  add_event as addEvent, see_achievement as seeAchievement, see_details as seeDetails, spend_achievement as spendAchievement, apply_celebrity as applyCelebrity
  from plan
  where plan_id = ? and is_active=1; 
  `
}

module.exports = {
  getListOfPlan,
  getPlanListById
}
