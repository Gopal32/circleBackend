const checkUserNewsById = () => {
  return `
  SELECT news_id as newsId, news_title as newsTitle, news_description as newsDescription, news_url as newsUrl, category_id as categoryId
  FROM news
  where news_id =? and created_by = ? and is_active = 1; `
}

const checkNewsByAll = () => {
  return `SELECT news_id as newsId, news_title as newsTitle, news_description as newsDescription, news_url as newsUrl, category_id as categoryId
  FROM news
  where news_title = ? and news_description = ? and news_url = JSON_ARRAY(?) and created_by = ? and category_id = ? and created_on > now() - interval 1 hour and is_active = 1; `
}

const updateNews = () => {
  return `update news 
  set news_title =? , news_description=?, news_url = JSON_ARRAY(?), category_id = ?, updated_on = now(), updated_by = ?
  where news_id = ? and created_by = ? and is_active = true;`
}

const insertNews = () => {
  return `insert into news (news_id, news_title, news_description,news_url,category_id, created_on, created_by, is_active) values
  (?,?,?,JSON_ARRAY(?),?,now(),?, true);
  update category 
  set post_count = post_count + 1
  where category_id = ? and is_active = true;
  `
}

const checkUsersNewsById = () => {
  return `
  SELECT news_id as newsId, news_title as newsTitle, news_description as newsDescription, news_url as newsUrl, category_id as categoryId
  FROM news
  where created_by = ? and is_active = 1
  order by created_on desc; `
}

const checkNewsById = () => {
  return `
  SELECT news_id as newsId, news_title as newsTitle, news_description as newsDescription, news_url as newsUrl, category_id as categoryId
  FROM news
  where news_id =? and is_active = 1; `
}

const checkSuggestNews = () => {
  return `
  SELECT news_id as newsId, news_title as newsTitle, news_description as newsDescription, news_url as newsUrl, category_id as categoryId
  FROM news
  where category_id in (?) and is_active = 1
  order by created_on desc; `
}

const deleteNewsByID = () => {
  return `
  update news 
  set is_active = ?
  where news_id = ? and created_by = ? and is_active = true;
  update category 
  set post_count = post_count - 1
  where category_id = ? and is_active = true;`
}

module.exports = {
  checkUserNewsById,
  checkNewsByAll,
  updateNews,
  insertNews,
  checkUsersNewsById,
  checkNewsById,
  checkSuggestNews,
  deleteNewsByID
}
