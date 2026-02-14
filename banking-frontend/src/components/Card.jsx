import { useNavigate } from "react-router-dom";

export default function Card({ title, value, link }) {

  const navigate = useNavigate();

  return (
    <div
      onClick={() => link && navigate(link)}
      className={`bg-white p-5 rounded-xl shadow cursor-pointer
        hover:shadow-lg hover:scale-[1.02] transition
        ${link ? "hover:bg-blue-50" : ""}
      `}
    >

      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

      {link && (
        <p className="text-xs text-blue-600 mt-2">
          Click to manage →
        </p>
      )}

    </div>
  );
}
