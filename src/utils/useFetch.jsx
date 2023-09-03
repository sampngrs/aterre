import { useState, useEffect, useContext} from "react";
import AlertContext from "../AlertContext";
import ThreeDotsWave from "../Components/ThreeDotsWave";

export default function useFetch(uri, text) {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useContext(AlertContext)

    useEffect(() => {
        if (loading) setAlert({text: <ThreeDotsWave />, type:'loading', active:loading})
    }, [loading])

    useEffect(() => {
        setAlert({text: <ThreeDotsWave />, type:'loading', active:loading})
    }, [data])

    function handleError(error){
        console.log(error)
        setLoading(false)
        setAlert({text: <span>{error.error}</span>, type:'error'})
        
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