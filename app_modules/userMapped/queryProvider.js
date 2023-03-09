const insertUpdateCategory = () => {
  return `
  update user_details 
  set category_id =JSON_ARRAY(?), updated_on = now(), updated_by = ? 
  where created_by = ? and is_active = true;
  `
}

const insertFollowMapped = () => {
  return `insert into user_follow_mapping (user_follow_mapping_id, followed_id, created_on, created_by) values
  (?,?,now(),?)
  `
}
const addCount = () => {
  return `
    UPDATE user_details ud 
    SET following_user_count = following_user_count + 1
    where created_by = ? and is_active = 1;
    UPDATE user_details ud 
    SET follower_user_count = follower_user_count + 1
    where created_by = ? and is_active = 1;`
}

const deleteFollowMapped = () => {
  return `DELETE FROM user_follow_mapping 
  WHERE created_by = ? and followed_id = ?;`
}

const removeCount = () => {
  return `
    UPDATE user_details ud 
    SET following_user_count = following_user_count - 1
    where created_by = ? and is_active = 1;
    UPDATE user_details ud 
    SET follower_user_count = follower_user_count - 1
    where created_by = ? and is_active = 1;`
}

const getUserdetails = () => {
  return `select ud.username as userName, ud.created_by as followUserId, ud.photo_url as photoUrl, ud.full_name as fullName, ud.description as description, ud.user_status as userStatus, if(ufm.user_follow_mapping_id is null, false, true) as isFollows from user_details ud 
  left join user_follow_mapping ufm on ud.created_by = ufm.followed_id  and ufm.created_by = ?
  where ud.created_by != ? limit 25 offset ?`
}
module.exports = {
  insertUpdateCategory,
  insertFollowMapped,
  addCount,
  deleteFollowMapped,
  removeCount,
  getUserdetails
}
