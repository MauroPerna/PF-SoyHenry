/* eslint-disable react-hooks/rules-of-hooks */
import type { NextPage } from "next";
import { TripCard } from "../../components/TripCard";
import Pagination from "../../components/pagination";
import { Trip } from "src/interfaces/Trip";
import { useState } from "react";
import { useQuery, dehydrate, QueryClient } from "react-query";
import { getTrips } from "src/utils/trips";

import {
  SimpleGrid,
  Box,
  Select,
  Stack,
  Input,
  Button,
  useColorModeValue,
  Heading,
  HStack,
  Text,
  Link,
  FormControl,
  Center,
} from "@chakra-ui/react";
import Layout from "../../components/layout/Layout";
import { BsArrowDownUp } from "react-icons/bs";
import { MdLabelImportantOutline } from "react-icons/md";
import TripsControllers from "src/controllers/trips";
import Loading from "src/components/Loading";
import axios from "axios";
import { BannedAlert } from "src/components/Banned";
import { useUser } from "@auth0/nextjs-auth0";
import { getOrCreateUser } from "src/utils/User";

interface Props {
  trips: Trip[];
}

function Trips({ trips }: Props) {
  const [sort, setSort] = useState<string>("desc"); // asc o desc orden
  const [wName, setName] = useState<string>(null); //para ordenar x nombre alfabeticamente
  const [wCity, setWcity] = useState<string>(""); //filtrar x actividad
  const [maxPrice, setMaxPrice] = useState<number>(0); // filtrar x precio
  const [sortBy, setSortBy] = useState<string>("name"); // ordenar x nombre o por precio
  const [input, setInput] = useState<string>("");
  const [inputCity, setInputCity] = useState<string>("");
  const { data, isLoading } = useQuery(
    ["trips", wCity, wName, maxPrice, sort, sortBy],
    //dependencies: React is going to re-render when one of these changes
    () => getTrips(wCity, wName, maxPrice, sort, sortBy)
  );
  const { user, error } = useUser();

  const { data: userDb } = useQuery(
    ["userDb", user],
    () => user && getOrCreateUser(user)
  );
  //const data = trips;
  const [currentPage, setCurrentPage] = useState(1);
  const [tripsPerPage, setTripsPerPage] = useState(8);
  const max = Math.ceil((data ? data.length : trips) / tripsPerPage);
  const [inputPage, setInputPage] = useState(1);

  if (sort === "Sort Order") setSort("desc");
  if (sortBy === "Sort By") setSortBy("name");

  const handleCity = () => {
    setWcity(inputCity);
    setInputCity("");
  };
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleMaxPrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMaxPrice(parseInt(input));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const handleInputCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCity(e.target.value);
  };
  const handleLoadAll = () => {
    setSort("desc");
    setName(null);
    setWcity("");
    setMaxPrice(0);
    setSortBy("name");
    setInput("");
    setInputCity("");
  };
  if (!isLoading && userDb && !userDb.data.active) {
    return <BannedAlert />;
  }
  return isLoading ? (
    <Loading />
  ) : (
    <Layout>
      <Heading
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        textAlign={"center"}
        mt={50}
        ml={120}
        marginBottom={"50px"}
      >
        <Text
          width={"1500px"}
          fontFamily={"Trebuchet MS"}
          color={useColorModeValue("#293541", "white")}
        >
          ALL OUR TRAVELERS TRIPS
        </Text>
        <Button
          bg={useColorModeValue("#02b1b1", "#02b1b1")}
          color={"white"}
          marginRight={"55px"}
          rounded={"md"}
          padding={"20px"}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
            bg: "#F3B46F",
            color: "black",
          }}
          m={5}
          w={200}
        >
          <Link href="/trips/create">Create new Trip</Link>
        </Button>
      </Heading>
      <Box
        display="flex"
        margin="20px"
        flex-direction="center"
        align-items="center"
        justifyContent={"space-around"}
        justifyItems={"center"}
      >
        <HStack
          height={"45px"}
          justifyContent={"center"}
          alignItems={"center"}
          spacing="10px"
        >
          <Text>Max price: </Text>
          <form onSubmit={(e) => handleMaxPrice(e)}>
            <Input
              width="80px"
              textAlign={"left"}
              placeholder="$"
              onChange={(e) => handleInput(e)}
              value={input}
              key={maxPrice}
            />
          </form>
        </HStack>

        <Select
          height={"45px"}
          width="250px"
          placeholder="Order by:"
          onChange={(e) => handleSortBy(e)}
        >
          <option value="name">Trips names </option>
          <option value="price">Price</option>
        </Select>
        <Select
          width="160px"
          placeholder={" ↑ ↓ "}
          onChange={(e) => handleSort(e)}
        >
          <option value={"asc"}>ascendent </option>
          <option value={"desc"}>descendent</option>
        </Select>
        <FormControl
          display={"flex"}
          align-items={"center"}
          width={"20%"}
          height={"45px"}
          justify-content={"center"}
        >
          <Input
            width="200px"
            marginRight={"20px"}
            placeholder="Type a City ..."
            onChange={(e) => handleInputCity(e)}
          />
          <Button
            bg={useColorModeValue("#151f21", "#293541")}
            color={"white"}
            type={"submit"}
            onClick={handleCity}
            rounded={"md"}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
          >
            Search
          </Button>
        </FormControl>
      </Box>
      <SimpleGrid minChildWidth="330px" columns={[2, null, 3]}>
        {data.length != 0 ? (
          data
            .slice(
              (currentPage - 1) * tripsPerPage,
              (currentPage - 1) * tripsPerPage + tripsPerPage
            )
            .map((t: Trip) => <TripCard key={t.id} props={t} />)
        ) : (
          <Box
            height={"38vh"}
            width={"100%"}
            justifyContent={"center"}
            alignContent={"center"}
          >
            <Text m={"15px"} textAlign={"center"} fontSize={"40px"}>
              Sorry! There are no trips with the selected condition.
            </Text>
            <Center>
              <Button
                fontSize={"40px"}
                bg={useColorModeValue("#151f21", "#293541")}
                color={"white"}
                type={"submit"}
                height={"60px"}
                p={"20px"}
                m={"25px"}
                rounded={"md"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                onClick={handleLoadAll}
              >
                Load all the trips again!
              </Button>
            </Center>
          </Box>
        )}
      </SimpleGrid>
      <Pagination
        inputPage={inputPage}
        setInputPage={setInputPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        max={max}
      />
    </Layout>
  );
}
// export const getServerSideProps = async () => {
//   const res = await axios("/trips");
//   const trips = await res.data;
//   return {
//     props: {
//       trips: trips,
//     },
//   };
// };

// export const getServerSideProps = async () => {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery( await TripsControllers.getTrips({}));
//   const trips = await TripsControllers.getTrips({});
//   return {
//     props: {
//       trips: trips,
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// };

export const getServerSideProps = async () => {
  const res = await axios.get("/trips");
  const trips = await res.data;

  return {
    props: {
      trips: trips,
    },
  };
};
export default Trips;
