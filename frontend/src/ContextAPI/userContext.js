import { useContext, createContext, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
  const [ads, setAds] = useState({});
  const [user, setUser] = useState({});
  const [lastPageVisited, setLastPageVisited] = useState();
  const [sellerDetail, setSellerDetail] = useState();

  const defineUser = (userObj) => setUser(userObj);
  const setLastPageURL = (URL) => setLastPageVisited(URL);
  const storeAds = adsObj => setAds(adsObj);
  const storeSellerDetail = detail => setSellerDetail(detail);

  return(
    <UserContext.Provider value={{user, defineUser, ads, storeAds, lastPageVisited, setLastPageURL, sellerDetail, storeSellerDetail}}>
      {children}
    </UserContext.Provider>
  );
}