import { useEffect, useState } from "react";
import Hero from "./Hero/Hero";
import EventCard from "./EventCard/EventCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import pageEvents from "../../types/pageEvents";
import pagination from "../../types/pagination";
import { fetchPublicEvents } from "../../HelperFunctions/apis";
import { Link } from "react-router-dom";
import CardSkeleton from "../Utils/CardSkeleton";

function findEventByNumPage(numPage: number, events: pageEvents[]) {
    return (
        events.find((event: pageEvents) => event.pageNum === numPage) || {
            events: [],
        }
    );
}

export default function Home() {
    const [shownEvents, setShownEvents] = useState<pageEvents[]>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [maxEventsPage, setMaxEventsPage] = useState<number>();
    const [paginationData, setPaginationData] = useState<pagination>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const eventsPerPage = 6;

    useEffect(() => {
        async function fetchData() {
            const publicEventsData = await fetchPublicEvents(eventsPerPage);

            setShownEvents([
                {
                    pageNum: publicEventsData.pageNum,
                    events: publicEventsData.events,
                },
            ]);
            setPaginationData({
                paginationTokensPerPage:
                    publicEventsData.paginationTokensPerPage,
                nextPaginationToken: publicEventsData.nextPaginationToken,
            });

            setMaxEventsPage(
                publicEventsData.paginationTokensPerPage.length + 1
            );
            setTimeout(() => setIsLoading(false), 1000);
        }

        fetchData();
    }, []);

    async function fetchNextPage(nextPageToken: string) {
        if (
            findEventByNumPage(currentPage + 1, shownEvents as pageEvents[])
                .events.length > 0
        ) {
            setCurrentPage((state) => state + 1);
            return;
        }

        if (
            !paginationData?.nextPaginationToken ||
            currentPage === maxEventsPage
        ) {
            return;
        }

        const nextEventData = await fetchPublicEvents(0, nextPageToken);

        setShownEvents((shownEvents) => [
            ...(shownEvents as pageEvents[]),
            {
                pageNum: nextEventData.pageNum,
                events: nextEventData.events,
            },
        ]);

        setPaginationData({
            paginationTokensPerPage: paginationData?.paginationTokensPerPage,
            nextPaginationToken: nextEventData.nextPaginationToken,
        });

        setCurrentPage((state) => state + 1);
    }

    async function fetchPage(numPage: number, pageToken: string) {
        if (pageToken === "firstPage") {
            setCurrentPage(numPage);
            return;
        }

        if (
            findEventByNumPage(numPage, shownEvents as pageEvents[]).events
                .length > 0
        ) {
            setCurrentPage(numPage);
            return;
        }

        if (currentPage === numPage) {
            return;
        }

        const eventsPageData = await fetchPublicEvents(0, pageToken);

        setShownEvents((shownEvents) => [
            ...(shownEvents as pageEvents[]),
            {
                pageNum: eventsPageData.pageNum,
                events: eventsPageData.events,
            },
        ]);

        setPaginationData({
            paginationTokensPerPage: paginationData?.paginationTokensPerPage,
            nextPaginationToken: eventsPageData.nextPaginationToken,
        });

        setCurrentPage(numPage);
    }

    async function fetchPreviousPage() {
        if (currentPage == 1) {
            return;
        }

        const pageToFetch = findEventByNumPage(
            currentPage - 1,
            shownEvents as pageEvents[]
        );

        if (pageToFetch.events.length === 0) {
            console.log(pageToFetch);

            const token: string =
                paginationData?.paginationTokensPerPage?.find(
                    (eventPage) => eventPage.pageNum === currentPage - 1
                )?.paginationToken || "";

            fetchPage(currentPage - 1, token);
            return;
        }

        setCurrentPage((state) => state - 1);
    }

    return (
        <div className="mb-10">
            <Hero />

            {/**
             *
             * TODO - Filter by Poupular and New events
             *
             */}

            <div className="flex flex-col justify-center px-5 py-10 gap-5">
                <h1 className="font-karla font-bold text-4xl drop-shadow-2xl text-center lg:text-6xl md:text-5xl">
                    Events
                </h1>
                <ul className="font-karla font-semibold flex justify-evenly items-center gap-4 lg:max-w-96 lg:self-center md:max-w-96 md:self-center">
                    <li className="text-lg border-2 border-black w-full text-center rounded-md text-white bg-black lg:w-28 lg:text-2xl md:w-32 md:text-2xl cursor-pointer">
                        All
                    </li>
                    <li className="text-lg border-2 border-black w-full text-center rounded-md lg:w-28 lg:text-2xl md:w-32 md:text-2xl cursor-pointer">
                        Popular
                    </li>
                    <li className="text-lg border-2 border-black w-full text-center rounded-md lg:w-28 lg:text-2xl md:w-32 md:text-2xl cursor-pointer">
                        New
                    </li>
                </ul>
            </div>

            {/**
             *
             *
             *
             */}

            <div className="flex flex-col gap-10 py-6 lg:flex-row lg:justify-center lg:flex-wrap md:flex-row md:justify-center md:flex-wrap md:pt-2">
                {shownEvents &&
                    !isLoading &&
                    findEventByNumPage(currentPage, shownEvents).events.map(
                        (event, i) => (
                            <Link to={`/eventdetails/${event.id}`} key={i}>
                                <EventCard {...event} key={event.id} />
                            </Link>
                        )
                    )}
                {isLoading &&
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    Array.from({ length: eventsPerPage }).map((_e, i) => (
                        <CardSkeleton key={i} />
                    ))}
            </div>

            <div className="font-spectral font-bold flex justify-center items-center gap-2 lg:gap-3 lg:mt-4 md:gap-3 md:mt-4">
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="text-xl cursor-pointer lg:text-3xl md:text-3xl"
                    onClick={fetchPreviousPage}
                />
                <ul className="flex justify-center items-center lg:text-2xl lg:gap-1 md:text-2xl md:gap-1">
                    <li
                        className={
                            currentPage == 1
                                ? "text-white bg-secondary-black-lighter px-1.5  rounded-md cursor-pointer"
                                : " px-2 py-1 rounded-md cursor-pointer"
                        }
                        onClick={() => fetchPage(1, "firstPage")}
                    >
                        {1}
                    </li>
                    {paginationData?.paginationTokensPerPage &&
                        paginationData.paginationTokensPerPage.map((page) => (
                            <li
                                key={page.pageNum}
                                className={
                                    page.pageNum == currentPage
                                        ? "text-white bg-secondary-black-lighter px-1.5  rounded-md cursor-pointer"
                                        : " px-2 py-1 rounded-md cursor-pointer"
                                }
                                onClick={() =>
                                    fetchPage(
                                        page.pageNum,
                                        page.paginationToken
                                    )
                                }
                            >
                                {page.pageNum}
                            </li>
                        ))}
                </ul>
                <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-xl lg:text-3xl md:text-3xl cursor-pointer"
                    onClick={() =>
                        fetchNextPage(
                            paginationData
                                ? paginationData.nextPaginationToken
                                : ""
                        )
                    }
                />
            </div>
        </div>
    );
}
