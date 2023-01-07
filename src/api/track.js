import instance from "./axios.config";
import storage from "../utils/localstorage";
import audioController from "../components/root/audio-controller";
import toast from "../components/notification/toast";

export const getAll = async (limit) => {
	try {
		const { tracks, album } = await instance.get(`/track?limit=${limit}`);
		return { tracks, album };
	} catch (error) {
		console.log(error.message);
	}
};

export const getOne = async (id) => {
	try {
		return await instance.get(`/track/${id}`);
	} catch (error) {
		console.log(error.message);
	}
};

export const getByUploader = async (limit) => {
	try {
		return await instance.get(`/track/user-uploaded?limit=${limit}`);
	} catch (error) {
		console.log(error);
	}
};

export const uploadTrack = async (formData) => {
	try {
		const { id } = await instance.post("/track-upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return id;
	} catch (error) {
		console.log(error);
	}
};

export const addToNextUp = (track) => {
	let nextUp = storage.get("nextUp");
	if (nextUp) {
		// check if track already exist in next up list
		let existedTrack = nextUp.find((item) => item._id == track._id) != undefined;
		if (existedTrack) {
			nextUp = nextUp.filter((item) => item._id != track._id); // remove the added song if it existed in next up
			nextUp.splice(1, 0, track); // push the song into 2nd place of next up
			storage.set("nextUp", nextUp); // save into localstorage
			return;
		}
		nextUp.splice(1, 0, track);
		storage.set("nextUp", nextUp);
	}
};

export const getNowPlayingTrack = async (nextUp) => {
	console.log(nextUp);
	if (nextUp && Array.isArray(nextUp) && nextUp.length == 0) {
		const [track] = await instance.get("/track");
		storage.set("nowPlaying", track);
		storage.set("nextUp", [track]);
		console.log(track);
		audioController.loadCurrentTrack(track);
	} else {
		const currentTrack = storage.get("nowPlaying");

		console.log(currentTrack);
		audioController.loadCurrentTrack(currentTrack);
	}
};
