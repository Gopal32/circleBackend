const getListOfPlan = () => {
  return `
  select plan_id as planId, plan_name as planName, see_voice as seeVoice, see_update_profile as seeUpdateProfile, add_voice as addVoice, see_news as seeNews, see_event as seeEvent, add_news as addNews,
  add_event as addEvent, see_achievement as seeAchievement, see_details as seeDetails, spend_achievement as spendAchievement, apply_celebrity as applyCelebrity
  from plan
  where plan_id != '3e1ae2fb-454b-4bb4-a9dd-dcdef2a40d73' and is_active=1; 
  `
}

module.exports = {
  getListOfPlan
}
