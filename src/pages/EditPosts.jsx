import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BASE_API_URL;

export default function EditPost({ fetchPosts, fetchTags, fetchCategories }) {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    img: "",
    content: "",
    category: "", // Utilizzeremo l'ID della categoria selezionata
    tags: [], // Array di ID dei tag selezionati
    published: false // Campo booleano per 'published'
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const url = `${apiUrl}/posts/${slug}`;
        const response = await axios.get(url);
        const postData = response.data;

        // Popoliamo il formData con i dati del post
        setPost(postData);
        setFormData({
          title: postData.title,
          img: postData.img,
          content: postData.content,
          category: postData.categoryId.toString(), // Convertiamo in stringa l'ID della categoria
          tags: postData.tags.map(tag => tag.id), // Array di ID dei tag
          published: postData.published // Imposta lo stato 'published'
        });
      } catch (error) {
        console.error("Errore durante il recupero del post:", error);
      }
    };

    fetchPost();
    fetchCategories(setCategories);
    fetchTags(setTags);
  }, [slug, fetchCategories, fetchTags]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Gestione checkbox dei tag
      if (checked) {
        setFormData({
          ...formData,
          tags: [...formData.tags, value]
        });
      } else {
        setFormData({
          ...formData,
          tags: formData.tags.filter(tagId => tagId !== value)
        });
      }
    } else {
      // Gestione altri input
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verifica dei campi obbligatori e tipi di dati prima di inviare
      if (!formData.category || isNaN(parseInt(formData.category))) {
        setError("Categoria non valida");
        return;
      }
      if (!formData.tags.length) {
        setError("Seleziona almeno un tag");
        return;
      }

      const url = `${apiUrl}/posts/${slug}`;
      await axios.post(url, formData);
      // Richiama la funzione di fetchPosts passata come props per aggiornare i dati
      fetchPosts();
      // Effettua il reindirizzamento manualmente
      window.location.href = `/posts/${slug}`;
    } catch (error) {
      console.error("Errore durante l'aggiornamento del post:", error);
      // Gestione degli errori dal backend
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        const errorMsg = errors.map(err => err.msg).join(", ");
        setError(errorMsg);
      } else {
        setError("Si è verificato un errore durante l'aggiornamento del post.");
      }
    }
  };

  if (!post) {
    return <p>Caricamento...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>
          Titolo:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Immagine URL:
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Contenuto:
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Categoria:
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Seleziona una categoria...</option>
            {categories.map(category => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Pubblicato:
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Tags:
          {tags.map(tag => (
            <label key={tag.id}>
              <input
                type="checkbox"
                name="tags"
                value={tag.id}
                checked={formData.tags.includes(tag.id)}
                onChange={handleInputChange}
              />{" "}
              {tag.name}
            </label>
          ))}
        </label>
      </div>
      <button type="submit">Aggiorna Post</button>
    </form>
  );
}
