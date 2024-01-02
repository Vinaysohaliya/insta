import React, { useEffect, useState } from 'react';
import userservice from '../Appwrite/user';
import SearchCard from './SearchCard';

const Search = () => {
    const [input, setInput] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await userservice.getUserbyName(input);
                setUsers(user.documents);

                if (input.trim() === "") {
                    setUsers([]);
                } else {
                    const user = await userservice.getUserbyName(input);
                    setUsers(user.documents);
                }
            } catch (error) {
                console.error(error);
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
        <div>
            <input type='search' style={{ color: 'black' }} onChange={handleChange}></input>
            {users && (
                <div>
                    {users.map((user) => (
                        <SearchCard key={user.$id} name={user.name} profileId={user.profileId} userId={user.$id} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Search;
