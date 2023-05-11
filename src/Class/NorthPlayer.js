const { DisTube } = require("distube");
require("dotenv").config({ path: ".env" });
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { DeezerPlugin } = require("@distube/deezer");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { ChatInputCommandInteraction } = require("discord.js");

class NorthPlayer extends DisTube {
  constructor(client) {
    super(client, {
      nsfw: true,
      emitNewSongOnly: true,
      leaveOnStop: false,
      youtubeCookie: process.env.YOUTUBE_COOKIE,
      youtubeIdentityToken: process.env.YOUTUBE_IDENTITY_TOKEN,
      emptyCooldown: 300,
      ytdlOptions: {
        lang: "en",
        liveBuffer: 10000,
        dlChunkSize: 0,
        highWaterMark: 1024 * 1024 * 64,
        quality: "highestaudio",
        filter: "audioonly",
      },
      plugins: [
        new YtDlpPlugin(),
        new DeezerPlugin({
          emitEventsAfterFetching: true,
        }),
        new SpotifyPlugin({
          emitEventsAfterFetching: true,
          api: {
            clientId: process.env.SPOTIFY_ID,
            clientSecret: process.env.SPOTIFY_SECRET,
          },
        }),
        new SoundCloudPlugin(),
      ],
      customFilters: {
        clear: "dynaudnorm=f=200",
        bassboost: "bass=g=20,dynaudnorm=f=200",
        "8D": "apulsator=hz=0.08",
        vaporwave: "aresample=48000,asetrate=48000*0.8",
        nightcore: "aresample=48000,asetrate=48000*1.25",
        phaser: "aphaser=in_gain=0.4",
        tremolo: "tremolo",
        vibrato: "vibrato=f=6.5",
        reverse: "areverse",
        treble: "treble=g=5",
        normalizer: "dynaudnorm=f=200",
        surrounding: "surround",
        pulsator: "apulsator=hz=1",
        subboost: "asubboost",
        karaoke: "stereotools=mlev=0.03",
        flanger: "flanger",
        gate: "agate",
        haas: "haas",
        mcompand: "mcompand",
      },
    });
  }

  /**
   * Remove a song from the queue.
   * @param {ChatInputCommandInteraction} interaction Command interaction.
   * @param {Number} index Song index.
   */
  removeTrack(interaction, index) {
    // Get the queue.
    const queue = this.queues.get(interaction.guild.id);

    if (typeof index !== 'number') throw new TypeError('Index must be a number.');
    if (!interaction instanceof ChatInputCommandInteraction) throw new TypeError('Interaction must be an instance of ChatInputCommandInteraction.');

    // Check if the index is valid.
    if (index < 1 || index > queue.songs.length) throw new RangeError('Index range must be between 1 and the queue length.');

    // Remove the song from the queue.
    queue.songs.splice(index - 1, 1);

    return true;
  }
}

module.exports = { NorthPlayer };