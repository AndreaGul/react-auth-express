import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BASE_API_URL;

export default function Post() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const url = `${apiUrl}/posts/${slug}`;
                const response = await axios.get(url);
                setPost(response.data);
                console.log('post singolo', response.data);
            } catch (error) {
                console.error("Errore durante il recupero del post:", error);
            }
        };

        fetchPost();

        return () => {
            setPost(null);
        };
    }, [slug]);

    if (!post) {
        return <p>Caricamento...</p>; // Mostra un messaggio di caricamento mentre i dati vengono recuperati
    }

    return (
        <>
            <h1> titolo:{post.title}</h1>
            
            <h2> immagine</h2>
            <img src={post.img} alt={post.title} />
            
            <p> contenuto{post.content} </p>
            <h4> Category: {post.category ? post.category.name : "N/A"} </h4>
            
               
                <h5>Tags:</h5>
                <ul> {post.tags.length > 0 ? post.tags.map(e=><li>{e.name}</li>) : "No tags"} </ul>
                
        </>
    );
}