import { use, useState } from "react";
import "../Planeta/Planeta.css"   
// me gaste mas tiempo en los css que en hacer la logica

export default function Planeta({ titulo, fecha, descripcion, imagen,imagenHD,autor}) {
  const [des, setDes] = useState(false);
  const [HD,setHD] = useState(false);

  /*el dia de hoy no habia un autor defindo tonces este campo es nulo y lo comparo aca 
  x q es una variable que afecta toda la logica no solo un componente
  dure como medio dia para lograrlo */
  autor = autor ? (autor) : ("no defindo");

  return (
    <div className={`contenedor-FotoDia ${des ? "con-descripcion" : "sin-descripcion"}`}>
        <div className="textoImagen-FotoDia">
          <p className="fecha-FotoDia">{fecha}</p>

          <h1 className="titulo-FotoDia">"{titulo}"</h1>

          <div className="contenedor-imagen">
               {HD ? 
               (<img className="imagen-FotoDia" 
                  src={imagenHD} />):
               (<img className="imagen-FotoDia" 
                  src={imagen} />)
               }
               
                <p className="autor-FotoDia">{autor}</p>
          </div>

           <div className="botones-FotoDia">
               <select className="select-FotoDia" 
                onChange={(e)=> setHD(e.target.value==="true")}>
                    <option value="" disabled > seleccione una opcion</option>
                    <option value={"false"}>normal</option>
                    <option value={"true"}>HD</option>
               </select>


                <button className="botonDescriipcion-FotoDia" 
                 onClick={() => setDes(!des)}>descripcion</button>
          </div>
        </div>
              {des && <p className="descripcion-FotoDia">{descripcion}</p>
}
        
    </div>
         
  );
}