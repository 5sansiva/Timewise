--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone,
    is_recurring boolean DEFAULT false,
    recurrence_pattern character varying(50),
    priority integer DEFAULT 1,
    user_id integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    all_day boolean DEFAULT false
);

CREATE TABLE public.users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL
);

ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, description, start_time, end_time, is_recurring, recurrence_pattern, priority, user_id, created_at, updated_at, all_day) FROM stdin;
96	Doctor's Appointment	\N	2022-10-13 10:00:00	2022-10-13 11:00:00	f	\N	1	\N	2024-11-10 00:26:18.006626	2024-11-10 00:26:18.006626	f
98	Doctor Appointment	\N	2023-10-05 15:00:00	2023-10-05 16:00:00	f	\N	1	\N	2024-11-10 00:27:01.365337	2024-11-10 00:27:01.365337	f
99	Doctor's Appointment	\N	2023-10-29 10:00:00	2023-10-29 11:00:00	f	\N	1	\N	2024-11-10 00:28:21.1518	2024-11-10 00:28:21.1518	f
138	dodoood	\N	2024-11-06 01:30:00	2024-11-06 02:30:00	\N	\N	\N	\N	2024-11-11 16:19:56.556072	2024-11-11 16:20:05.192976	f
132	no	\N	2024-11-05 00:00:00	2024-11-05 23:59:00	\N	\N	\N	\N	2024-11-10 06:07:22.324911	2024-11-11 16:20:30.456846	t
140	holiday	\N	2024-11-15 00:00:00	2024-11-16 00:00:00	f	\N	1	\N	2024-11-11 16:22:30.540783	2024-11-11 16:22:30.540783	t
\.


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 140, true);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

