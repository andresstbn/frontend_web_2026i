export default function ApodCard({ data }) {
  if (!data) return null;
 
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };
 
  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "16px",
      background: "#fff"
    }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "4px" }}>
        {data.title}
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "16px" }}>
        {formatDate(data.date)}
      </p>
 
      {data.media_type === "image" ? (
        <img
          src={data.url}
          alt={data.title}
          style={{ width: "100%", maxWidth: "600px", borderRadius: "8px", display: "block", margin: "0 auto 16px" }}
        />
      ) : (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2563eb", display: "block", marginBottom: "16px" }}
        >
          Abrir video en una nueva pestaña
        </a>
      )}
 
      {data.explanation && (
        <p style={{ lineHeight: "1.6", color: "#374151" }}>{data.explanation}</p>
      )}
    </div>
  );
}