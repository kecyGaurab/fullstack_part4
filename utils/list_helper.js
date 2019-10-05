

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



module.exports = {
	dummy,
	totalLikes
}