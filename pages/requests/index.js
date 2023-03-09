import { useState, useEffect } from 'react';
import axios from 'axios';

const useAllRequests = (accessToken) => {
  const [requests, setRequests] = useState([]);
  const [isLoadingAllRequests, setIsLoadingAllRequests] = useState(false);
  const [isAllRequestsError, setIsAllRequestsError] = useState(false);

  useEffect(() => {
    setIsLoadingAllRequests(true);
    axios.get('/api/requests', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(response => {
        setRequests(response.data);
        setIsLoadingAllRequests(false);
      })
      .catch(error => {
        setIsAllRequestsError(true); // intentionally throwing an error
        setIsLoadingAllRequests(false);
      });
  }, [accessToken]);

  return { requests, isLoadingAllRequests, isAllRequestsError };
};

export default useAllRequests;