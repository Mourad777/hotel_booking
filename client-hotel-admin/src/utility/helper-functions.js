export const processCategories = (categories) => {
    const processedCategories = (categories || []).map(cat => {
        return { key: cat.name, value: cat.name, text: cat.name, _id: cat.id }
    });
    return processedCategories.reverse();
}

export const processComments = (comments) => {
    //recursive function to get replies
    const processedComments = [];

    const getReplies = (comments) => {
        comments.forEach(c => {
            processedComments.push(c)
            if ((c.replies || []).length > 0) {
                getReplies(c.replies)
            }
        })
    }

    getReplies(comments)

    return processedComments;
}