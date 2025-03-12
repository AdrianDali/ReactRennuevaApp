const sortData = (data, sortBy, order) => {
    if(data.length === 0) return data;
    if (typeof data[0][sortBy] === 'number') {
        const sorted = [...data].sort((a, b) => {
            if (order === 'asc') {
                return a[sortBy] - b[sortBy];
            } else if(order === 'desc') {
                return b[sortBy] - a[sortBy];
            }
        });
        return sorted;
    }else if (typeof data[0][sortBy] === 'string') {
        return data.sort((a, b) => {
            if (order === 'asc') {
                return a[sortBy].localeCompare(b[sortBy]);
            } else if(order === 'desc') {
                return b[sortBy].localeCompare(a[sortBy]);
            }
        }
        )
    }
}

export default sortData;