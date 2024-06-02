export const getTime = () => {
    const now = new Date();

    const timeOptions = {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    };

    return new Intl.DateTimeFormat('en-US', timeOptions).format(now);
}

export const getDate = () => {
    const now = new Date();

    const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    return new Intl.DateTimeFormat('en-US', dateOptions).format(now);
}