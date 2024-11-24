import {
  Box,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import SuggestedUser from "../components/SuggestedUser";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const UserSkeleton = () => (
  <Flex gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
    <Box>
      <SkeletonCircle size={"10"} />
    </Box>
    <Flex w={"full"} flexDirection={"column"} gap={2}>
      <Skeleton h={"8px"} w={"80px"} />
      <Skeleton h={"8px"} w={"90px"} />
    </Flex>
    <Flex>
      <Skeleton h={"20px"} w={"60px"} />
    </Flex>
  </Flex>
);

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const showToast = useShowToast();
  const { t } = useTranslation();
  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/search");
        const data = await res.json();
        console.log("Fetched data:", data); // Log the response to check its structure

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // Ensure data is an array before setting the state
        if (Array.isArray(data)) {
          setSuggestedUsers(data);
        } else {
          showToast("Error", "Invalid data format", "error");
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, [showToast]);

  const filteredUsers = suggestedUsers.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Text mb={4} fontWeight={"bold"} color={"#777777"}>
       {t('suggest')}
      </Text>
      <Input
        placeholder= {t('search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <Flex direction={"column"} gap={4}>
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => <UserSkeleton key={idx} />)
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))
        ) : (
          <Text>No users found.</Text>
        )}
      </Flex>
    </>
  );
};

export default SearchPage;
