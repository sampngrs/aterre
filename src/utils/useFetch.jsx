import { useState, useEffect} from "react";

export default function useFetch(uri) {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!uri) return;
        setLoading(true)
        fetch(uri)
            .then(data => data.json())
            .then(setData)
            .then(()=> setLoading(false))
            .catch(setError);
        }, [uri]);
    
    return {loading, data, error};
}