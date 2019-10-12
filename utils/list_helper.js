

const dummy = (blogs) => {
	if(blogs){
		return 1
	}
}

const totalLikes = (blogs) => {
	const result =	blogs.reduce((acc, blogs) => {
		return blogs.length === 1 ? blogs.like:acc+blogs.likes
	},0)
	return result
}

const favoriteBlog = (blogs) => {
	const mostLikes = Math.max.apply(Math, blogs.map(blog => blog.likes))
	const blogMaxLikes = blogs.find(blog => blog.likes === mostLikes)
	return blogMaxLikes
}


module.exports = {
	dummy,
	totalLikes,
	favoriteBlog
}