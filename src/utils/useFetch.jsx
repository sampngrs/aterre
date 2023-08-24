import { useState, useEffect} from "react";

export default function useFetch(uri) {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    function handleError(error){
        console.log(error.error)
        setData()
        setLoading(false)
    }

    useEffect(() => {
        if (!uri) return;
        setLoading(true)
        fetch(uri)
            .then(data => data.json())
            .then((data) => {
                if (data.error) throw data
                else setData(data)
            })            
            .then(() => setLoading(false))
            .catch(handleError)
        }, [uri]);
    

    return {loading, data, error};
}

export function Fetch({
    uri, 
    renderSuccess, 
    loadingFallback = <p>...loading</p>, 
    renderError = error => (<pre>{JSON.stringify(error, null, 2)}</pre>)
}) {
    const {loading, data, error} = useFetch(uri);
    if (loading) return loadingFallback;
    if (error) return renderError(error);
    if (data) return renderSuccess({data});
}