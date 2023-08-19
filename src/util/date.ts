const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString();
}

export default formatDate;