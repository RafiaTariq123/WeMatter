const isQuestionnaireComplete = (user) => {
    if( !user || Object.keys(user).length === 0 )
        return false

    if(!user.labels || user.labels.length === 0)
        return false

    return true
} 

const isProfileComplete = (user) => {
    if (!user || Object.keys(user).length === 0)
        return false

    // For psychologists, check essential fields only
    const essentialFields = ['firstName', 'lastName', 'email']
    
    // Check if all essential fields are present and not null/undefined
    for (const field of essentialFields) {
        if (!user[field] || user[field] === null || user[field] === undefined) {
            return false
        }
    }

    return true
}

export { isProfileComplete , isQuestionnaireComplete}