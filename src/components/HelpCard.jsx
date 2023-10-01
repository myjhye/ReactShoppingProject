import { useNavigate } from "react-router-dom"
import { IoIosImages } from 'react-icons/io';

export default function HelpCard({helps}) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => { navigate(`/help/${helps.id}`, { state: { helps } }) }}
            key={helps.id}
            className="bg-white p-4 rounded-lg shadow-md"
        >
            <div className="text-2xl flex">
                <h3 className="text-xl font-semibold truncate">
                    {helps.title}
                </h3>
                {helps.imageUrl && (
                    <div className="ml-auto">
                        <IoIosImages />
                    </div>
                )}
            </div>
            <p className="text-gray-600">{helps.date}</p>
            <br />
            
            <p className="text-black truncate">{helps.content}</p>
        </div>
    )
}