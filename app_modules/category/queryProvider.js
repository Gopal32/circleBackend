
// SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage ,
//        CASE WHEN (SELECT COUNT(*) FROM category WHERE post_count < 100 and is_active = 1) > 0
//             THEN  null
//             ELSE post_count
//        END as postCount,
//        CASE WHEN (SELECT COUNT(*) FROM category WHERE followers_count < 1000 and is_active = 1) > 0
//             THEN  null
//             ELSE followers_count
//        END as followerCount
// FROM category
// where is_active = 1;
const getCategorywithPostAndFollower = () => {
  return `
  SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage, post_count as postCount, followers_count as followersCount
  FROM category
  where is_active = 1; `
}

const getPostFollowerCount = () => {
  return `
  SELECT COUNT(post_count) as postCount FROM category WHERE post_count < 100 and is_active = 1;
  SELECT COUNT(followers_count) as followersCount FROM category WHERE followers_count < 1000 and is_active = 1;`
}
const getCategory = () => {
  return `
  SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage 
  FROM category
  where is_active = 1; `
}

const addCategory = () => {
  return `
  insert into category (category_id, category_name, category_description, created_on, created_by, is_active) values
  (?,?,?,now(),?, true) `
}

const checkCategory = () => {
  return `SELECT category_id as categoryId, category_name as categoryName, category_description as categoryDescription, category_image as categoryImage, post_count as postCount, followers_count as followersCount
  FROM category
  where category_id = ? or category_name = ? and is_active = 1;`
}

const updateCategory = () => {
  return `update category 
  set category_description =? , updated_on = now(), updated_by = ? 
  where category_id = ? and is_active = true`
}

const updateFollowCount = (oldCategoryId) => {
  let addQuery = ''
  if (oldCategoryId.length > 0) {
    addQuery += `update category 
    set followers_count = followers_count - 1
    where category_id in (?) and is_active = true;`
  }
  return `update category 
  set followers_count = followers_count + 1
  where category_id in (?) and is_active = true;
  ${addQuery}`
}

const getCategoryByCategoryId = () => {
  return `
  SELECT GROUP_CONCAT(category_id) as categoryId
  FROM category
  where category_id in (?) and is_active = 1; 
  `
}

module.exports = {
  getCategorywithPostAndFollower,
  getPostFollowerCount,
  getCategory,
  addCategory,
  checkCategory,
  updateCategory,
  updateFollowCount,
  getCategoryByCategoryId
}
