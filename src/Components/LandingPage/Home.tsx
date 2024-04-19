import { useEffect, useState } from "react";
import Hero from "./Hero/Hero";
import EventCard from "./EventCard/EventCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import pageEvents from "../../types/pageEvents";
import pagination from "../../types/pagination";
import { fetchPublicEvents } from "../../HelperFunctions/apis";

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

    useEffect(() => {
        async function fetchData() {
            const publicEventsData = await fetchPublicEvents(2);

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
        <>
            <Hero />

            {/**
             *
             * TODO - Filter by Poupular and New events
             *
             */}

            <div className="flex flex-col justify-center px-5 py-10 gap-5">
                <h1 className="font-karla font-bold text-4xl drop-shadow-2xl text-center">
                    Events
                </h1>
                <ul className="font-karla font-semibold flex justify-evenly items-center gap-4">
                    <li className="text-lg border-2 border-black w-full text-center rounded-md text-white bg-black">
                        All
                    </li>
                    <li className="text-lg border-2 border-black w-full text-center rounded-md">
                        Popular
                    </li>
                    <li className="text-lg border-2 border-black w-full text-center rounded-md">
                        New
                    </li>
                </ul>
            </div>

            {/**
             *
             *
             *
             */}

            <div className="flex flex-col gap-10 py-6">
                {shownEvents &&
                    findEventByNumPage(currentPage, shownEvents).events.map(
                        (event) => <EventCard {...event} key={event.id} />
                    )}
            </div>

            <div className="font-spectral font-bold flex justify-center items-center gap-2">
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    size="lg"
                    onClick={fetchPreviousPage}
                />
                <ul className="flex justify-center items-center">
                    <li
                        className={
                            currentPage == 1
                                ? "text-white bg-secondary-black-lighter px-1.5  rounded-md"
                                : " px-2 py-1 rounded-md"
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
                                        ? "text-white bg-secondary-black-lighter px-1.5  rounded-md"
                                        : " px-2 py-1 rounded-md"
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
                    size="lg"
                    onClick={() =>
                        fetchNextPage(
                            paginationData
                                ? paginationData.nextPaginationToken
                                : ""
                        )
                    }
                />
            </div>
        </>
    );
}
