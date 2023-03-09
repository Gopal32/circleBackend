const getUserDataByEmailOrUsername = () => {
  return `select u.user_id as userId, email, salt_key as saltKey, hash_password as hashPassword, signup_type as signupType
  from users u
  join user_details ud on ud.created_by = u.user_id and ud.is_active = true
  where ud.username = ? or lower(u.email) = lower(?) and u.is_active = true and u.is_verified = true and u.is_profile_completed = true`
}

const getUserDataByEmail = (forgetKey) => {
  let value = ''
  if (forgetKey) value = 'and u.is_verified = true and u.is_profile_completed = true'
  return `select u.user_id as userId, email, salt_key as saltKey, hash_password as hashPassword, signup_type as signupType, u.is_verified as isVerified, u.is_profile_completed as isProfileCompleted
  from users u
  where lower(u.email) = lower(?) ${value} and u.is_active = true;`
}

const getUserDetailsByUserId = (changePwd) => {
  let value
  if (changePwd) value = 'and u.is_verified = true and u.is_profile_completed = true'
  return `select u.user_id as userId, email, salt_key as saltKey, hash_password as hashPassword, signup_type as signupType
  from users u
  where u.user_id = ?  ${value} and u.is_active = true`
}
const createUser = () => {
  return `insert into users ( email, user_id,created_by,created_on, signup_type, is_active) values 
  (?,?,?, now(), ?, 1)`
}

const getUserDetailsByUsername = () => {
  return `select username from user_details 
  where username = ? and is_active = true`
}

const setUserdetails = () => {
  return `insert into user_details (user_detail_id, username, full_name, plan_id, created_on, created_by, is_active) values
  (?,?,?,?,now(),?, true)`
}

const setUserPwd = () => {
  return `update users 
  set hash_password =? , salt_key=?, updated_on = now(), updated_by = ?, is_profile_completed = 1
  where user_id = ? and is_active = true`
}

const updatePhotoUrl = () => {
  return `update user_details 
  set photo_url =? , updated_on = now(), updated_by = ? 
  where created_by = ? and is_active = true`
}

const updateotpVerifed = () => {
  return `update users 
  set is_verified = true, is_profile_completed = ?, updated_on = now(), updated_by = ?
  where user_id = ? and is_active = true`
}

const updatePwd = () => {
  return `update users
  set hash_password = ?, updated_on = now(), updated_by = ?
  where user_id = ? and is_verified = true and is_profile_completed = true and is_active = true `
}

const userDetails = () => {
  return `select username, full_name as fullName, photo_url as photoUrl, category_id as categoryId, plan_id as planId, following_user_count as followingUserCount, following_user_count as followingUserCount, description, user_status as userStatus, free_trial as freeTrial, created_on as createdOn
  from user_details
  where created_by = ? and is_active = true`
}

const updatePlan = () => {
  return `update user_details 
  set plan_id =? , updated_on = now(), updated_by = ? 
  where created_by = ? and is_active = true`
}

module.exports = {
  // getUserRoleData,
  getUserDataByEmailOrUsername,
  createUser,
  getUserDetailsByUsername,
  setUserdetails,
  setUserPwd,
  updatePhotoUrl,
  getUserDetailsByUserId,
  getUserDataByEmail,
  updateotpVerifed,
  updatePwd,
  userDetails,
  updatePlan
}
