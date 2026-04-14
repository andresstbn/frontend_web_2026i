'use client';
import { useState, useEffect } from 'react';
import { Button, RadioButton, Input } from '@/components';

export default function NasaPage() {
  const [option, setOption] = useState('date'); // 'today', 'date', 'count'
  const [dateValue, setDateValue] = useState('2026-04-09');
  const [countValue, setCountValue] = useState(1);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentUrl, setCurrentUrl] = useState('');

  const API_KEY ='FbcbLLcty8XuhJi7IXzZmQxCiwGIPqB30xqSepQN';

  const fetchNasa = async () => {
    setLoading(true);
    setError(null);

    let params = `api_key=${API_KEY}`;
    if (option === 'date' && dateValue) params += `&date=${dateValue}`;
    if (option === 'count') params += `&count=${countValue}`;

    const url = `https://api.nasa.gov/planetary/apod?${params}`;
    setCurrentUrl(url);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error en la respuesta de la NASA');
      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResults([]);
    setError(null);
    setCurrentUrl('');
  };

  return (
    <main style={{ padding: '40px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Ejercicio React: NASA APOD</h1>

      <section style={{ border: '1px solid #eee', padding: '20px', borderRadius: '15px', backgroundColor: '#fafafa', marginBottom: '30px' }}>
        <p><strong>1) Modo de consulta (radio)</strong></p>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <RadioButton label="Foto de hoy" name="mode" value="today" checked={option === 'today'} onChange={() => setOption('today')} />
          <RadioButton label="Fecha especifica" name="mode" value="date" checked={option === 'date'} onChange={() => setOption('date')} />
          <RadioButton label="Aleatorias (count)" name="mode" value="count" checked={option === 'count'} onChange={() => setOption('count')} />
        </div>

        {option === 'date' && (
          <div style={{ marginBottom: '20px' }}>
            <p><strong>2) Fecha</strong></p>
            <Input type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} style={{ width: '100%' }} />
          </div>
        )}

        {option === 'count' && (
          <div style={{ marginBottom: '20px' }}>
            <p><strong>2) Cantidad</strong></p>
            <Input type="number" min="1" max="10" value={countValue} onChange={(e) => setCountValue(e.target.value)} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <Button onClick={fetchNasa} disabled={loading} style={{ backgroundColor: '#1a56ff', color: 'white' }}>
            {loading ? 'Consultando...' : 'Consultar NASA APOD'}
          </Button>
          <Button onClick={clear} variant="secondary">
            Limpiar resultado
          </Button>
        </div>

        {currentUrl && (
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#888', wordBreak: 'break-all' }}>
            URL actual: {currentUrl}
          </p>
        )}
      </section>

      {results.map((item, index) => (
        <article key={index} style={{ border: '1px solid #eee', padding: '30px', borderRadius: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>{item.title}</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>{item.date}</p>

          {item.media_type === 'image' ? (
            <img src={item.url} alt={item.title} style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }} />
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#4169E1', textDecoration: 'underline', fontWeight: 'bold' }}
              >
                Abrir video en una nueva pestaña
              </a>
            </div>
          )}

          <p style={{ textAlign: 'justify', lineHeight: '1.5', color: '#333' }}>
            {item.explanation}
          </p>
        </article>
      ))}
    </main>
  );
}