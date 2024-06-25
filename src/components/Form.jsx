import { useState } from 'react';
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_API_URL;

export default function Form({ tags, categories, onCreate }) {
    const initialData = {
        title: '',
        img: '',
        content: '',
        categoryId: '',
        tags: [],
        published: false,
    };

    const [formData, setFormData] = useState(initialData);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('formdata',formData)
            const res = await axios.post(`${apiUrl}/posts`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (res.status < 400) {
                onCreate();
            }
        } catch (error) {
            console.error("Errore durante la creazione del post:", error);
        }
    };

    const handleFormField = (objectKey, value) => {
        setFormData((currObject) => ({
            ...currObject,
            [objectKey]: value,
        }));
    };

  

    const renderField = (objKey, value) => {
        if (typeof value === 'boolean') {
            return (
                <label key={`formElement${objKey}`} className="input-css">
                    {objKey}
                    <input
                        name={objKey}
                        type="checkbox"
                        checked={formData[objKey]}
                        onChange={(e) => handleFormField(objKey, e.target.checked)}
                    />
                </label>
            );
        } else if (Array.isArray(value)) {
            if (objKey === 'tags') {
                return (
                    <div key={`formElement${objKey}`}>
                        <h5>Tags:</h5>
                        <ul>
                            {tags.length > 0 ? (
                                tags.map(({ id, name }, index) => (
                                    <li key={`item${index}`}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.tags.includes(id)}
                                                onChange={() => {
                                                    const curr = formData.tags;
                                                    const newTags = curr.includes(id)
                                                        ? curr.filter((e) => e !== id)
                                                        : [...curr, parseInt(id)]; // Conversione ID in numero intero
                                                    handleFormField('tags', newTags);
                                                }}
                                            />
                                            {name}
                                        </label>
                                    </li>
                                ))
                            ) : (
                                <li>No tags available</li>
                            )}
                        </ul>
                    </div>
                );
            }
        } else if (objKey === 'categoryId') {
            return (
                <div key={`formElement${objKey}`}>
                    <h5>Categoria:</h5>
                    <select
                        className="input-css"
                        value={formData.categoryId}
                        onChange={(e) => handleFormField(objKey, parseInt(e.target.value))} // Conversione ID in numero intero
                    >
                        <option value="" disabled>Seleziona una categoria</option>
                        {categories.map(({ id, name }) => (
                            <option key={`category${id}`} value={id}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
            );
        } else if (objKey === 'img') {
            return (
                <div key={`formElement${objKey}`} className="input-css container-input-img">
                    <label>
                        {objKey}
                        <input className="input-img" type="file" onChange={(e)=> handleFormField(objKey,e.target.files[0])} />
                    </label>
                </div>
            );
        } else {
            return (
                <input
                    key={`formElement${objKey}`}
                    name={objKey}
                    type={typeof value === 'number' ? 'number' : 'text'}
                    placeholder={objKey}
                    className="input-css"
                    value={formData[objKey]}
                    onChange={(e) => handleFormField(objKey, e.target.value)}
                />
            );
        }
    };

    return (
        <>
            <div className="form-section">
                <form onSubmit={handleSubmit} className="form-container">
                    <h2>Aggiungi un nuovo post</h2>
                    <div className="form-fields">
                        {Object.keys(initialData).map((objKey) =>
                            renderField(objKey, initialData[objKey])
                        )}
                    </div>
                    <button className="button-css">Aggiungi</button>
                </form>
            </div>
        </>
    );
}