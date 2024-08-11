import { useEffect, useState } from 'react';

export const useLocalStorageData = (key, initialValue) => {
    const [data, setData] = useState(initialValue);

    useEffect(() => {
        const handleStorageChange = () => {
            const value = localStorage.getItem(key);
            if (value) {
                setData(JSON.parse(value));
            }
        };

        const fetchData = () => {
            const value = localStorage.getItem(key);
            if (value) {
                setData(JSON.parse(value));
            }
        };

        // NOTE: Initial Fetch
        fetchData();
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return data;
};