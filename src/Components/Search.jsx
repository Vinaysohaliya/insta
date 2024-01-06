import React, { useEffect, useState } from 'react';
import userservice from '../Appwrite/user';
import SearchCard from './SearchCard';
import { IoMdClose } from "react-icons/io";
import Loader from '../Components/Loader/Loader';

const Search = ({ setSearchVisible }) => {

    const [input, setInput] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                if (input.trim() === "") {
                    setUsers([]);
                } else {
                    const user = await userservice.getUserbyName(input);
                    setUsers(user.documents);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchData();
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [input]);

    function handleChange(e) {
        setInput(e.target.value);
    }

    return (
        <div className=' bg-slate-50 text-black w-full md:w-1/3 h-1/2 flex flex-col p-4 rounded-md'>
            <div className='flex items-center justify-between mb-4'>
                <div className='text-xl font-bold'>Search User</div>
                <button
                    onClick={() => setSearchVisible(false)}
                >
                    <IoMdClose className='text-black' />
                </button>
            </div>
            <div className='mb-2'>Username</div>
            <input
                type='search'
                className='bg-gray-800 text-white border border-gray-700 p-2 rounded-md mb-2'
                onChange={handleChange}
            />
            <div>
                {isLoading && <div className=' flex h-full items-center justify-center'>
                    <Loader />
                </div>} 
                {!isLoading && users.length === 0 && (
                    <p className="text-center text-gray-500">No users found</p>
                )}
                {users.length > 0 && (
                    <div className='max-h-40 md:max-h-30 overflow-y-scroll'>
                        {users.map((user) => (
                            <SearchCard key={user.$id} name={user.name} profileId={user.profileId} userId={user.$id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
