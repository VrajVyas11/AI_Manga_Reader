// src/constants/filterOptions.js

const filterOptions = {
  ratings: [
    { id: 'safe', label: 'Safe', color: 'bg-emerald-500' },
    { id: 'suggestive', label: 'Suggestive', color: 'bg-amber-500' },
    { id: 'erotica', label: 'Erotica', color: 'bg-rose-500' },
    { id: 'pornographic', label: 'Adult', color: 'bg-red-700' },
  ],
  statuses: [
    { id: 'ongoing', label: 'Ongoing', color: 'bg-emerald-400' },
    { id: 'completed', label: 'Completed', color: 'bg-blue-400' },
    { id: 'hiatus', label: 'Hiatus', color: 'bg-amber-400' },
    { id: 'cancelled', label: 'Cancelled', color: 'bg-red-400' },
  ],
  languages: [
    { id: 'en', label: 'English' },
    { id: 'ja', label: 'Japanese' },
    { id: 'ko', label: 'Korean' },
    { id: 'zh', label: 'Chinese (Simplified)' },
    { id: 'zh-hk', label: 'Chinese (Traditional)' },
    { id: 'fr', label: 'French' },
    { id: 'de', label: 'German' },
    { id: 'es', label: 'Spanish' },
    { id: 'es-la', label: 'Spanish (Latin America)' },
    { id: 'it', label: 'Italian' },
    { id: 'pt', label: 'Portuguese' },
    { id: 'pt-br', label: 'Portuguese (Brazil)' },
    { id: 'ru', label: 'Russian' },
    { id: 'th', label: 'Thai' },
    { id: 'vi', label: 'Vietnamese' },
    { id: 'id', label: 'Indonesian' },
    { id: 'ar', label: 'Arabic' },
    { id: 'af', label: 'Afrikaans' },
    { id: 'sq', label: 'Albanian' },
    { id: 'az', label: 'Azerbaijani' },
    { id: 'eu', label: 'Basque' },
    { id: 'be', label: 'Belarusian' },
    { id: 'bn', label: 'Bengali' },
    { id: 'bg', label: 'Bulgarian' },
    { id: 'my', label: 'Burmese' },
    { id: 'ca', label: 'Catalan' },
    { id: 'cv', label: 'Chuvash' },
    { id: 'hr', label: 'Croatian' },
    { id: 'cs', label: 'Czech' },
    { id: 'da', label: 'Danish' },
    { id: 'nl', label: 'Dutch' },
    { id: 'eo', label: 'Esperanto' },
    { id: 'et', label: 'Estonian' },
    { id: 'tl', label: 'Filipino' },
    { id: 'fi', label: 'Finnish' },
    { id: 'ka', label: 'Georgian' },
    { id: 'el', label: 'Greek' },
    { id: 'he', label: 'Hebrew' },
    { id: 'hi', label: 'Hindi' },
    { id: 'hu', label: 'Hungarian' },
    { id: 'ga', label: 'Irish' },
    { id: 'jv', label: 'Javanese' },
    { id: 'kk', label: 'Kazakh' },
    { id: 'la', label: 'Latin' },
    { id: 'lt', label: 'Lithuanian' },
    { id: 'ms', label: 'Malay' },
    { id: 'mn', label: 'Mongolian' },
    { id: 'ne', label: 'Nepali' },
    { id: 'no', label: 'Norwegian' },
    { id: 'fa', label: 'Persian' },
    { id: 'pl', label: 'Polish' },
    { id: 'ro', label: 'Romanian' },
    { id: 'sr', label: 'Serbian' },
    { id: 'sk', label: 'Slovak' },
    { id: 'sl', label: 'Slovenian' },
    { id: 'sv', label: 'Swedish' },
    { id: 'ta', label: 'Tamil' },
    { id: 'te', label: 'Telugu' },
    { id: 'tr', label: 'Turkish' },
    { id: 'uk', label: 'Ukrainian' },
    { id: 'ur', label: 'Urdu' },
    { id: 'uz', label: 'Uzbek' },
  ],
  demographics: [
    { id: 'shounen', label: 'Shounen' },
    { id: 'shoujo', label: 'Shoujo' },
    { id: 'seinen', label: 'Seinen' },
    { id: 'josei', label: 'Josei' },
    { id: 'none', label: 'None' },
  ],
  publicationTypes: [
    { id: 'manga', label: 'Manga' },
    { id: 'manhwa', label: 'Manhwa'},
    { id: 'manhua', label: 'Manhua' },
  ],
  formats: [
    { id: 'b9cb033c-5976-4d21-87e8-3652582520e5', label: '4-Koma' },
    { id: 'f4122d1c-3b44-44d0-9936-ff7502c39ad3', label: 'Adaptation' },
    { id: '51d83883-4103-437c-b4b1-731cb73d786c', label: 'Anthology' },
    { id: '52d2f589-385b-491b-b0d6-bfb46055b09a', label: 'Award Winning' },
    { id: 'f29bdd13-6406-4b72-99f4-ed0e67794406', label: 'Doujinshi' },
    { id: 'f5097a3c-36ed-407a-ab04-0fc209dd6cb4', label: 'Fan Colored' },
    { id: 'f5ba408b-0e7a-484d-8d49-4e9125ac96de', label: 'Full Color' },
    { id: '3e2b8dae-350e-4ab8-a8ce-016e844b9f0d', label: 'Long Strip' },
    { id: '320831a8-4026-470b-94f6-8353740e6f04', label: 'Official Colored' },
    { id: '0234a31e-a729-4e28-9d6a-3f87c4966b9e', label: 'Oneshot' },
    { id: 'a1c08ce5-f8e9-4088-92b4-867c40b663a7', label: 'Self-Published' },
    { id: 'e197df38-d0e7-43b5-9b09-2842d0c326dd', label: 'Web Comic' },
  ],
  genres: [
    { id: '391b0423-d847-456f-aff0-8b0cfc03066b', label: 'Action' },
    { id: '87cc87cd-a395-47af-b27a-93258283bbc6', label: 'Adventure' },
    { id: '4d32cc48-9f00-4cca-9b5a-a839f0764984', label: 'Comedy' },
    { id: 'b9af3a63-f058-46de-a9a0-e0c13906197a', label: 'Drama' },
    { id: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc', label: 'Fantasy' },
    { id: 'f8f62932-27da-4fe4-8ee1-6779a8c5edba', label: 'Horror' },
    { id: '3e2b8dae-350e-4ab8-a8ce-016e844b9f0d', label: 'Mystery' },
    { id: '423e2eae-a7a2-4a8b-ac03-a8351462d71d', label: 'Romance' },
    { id: '256c8bd9-4904-4360-bf4f-508a76d67183', label: 'Sci-Fi' },
    { id: 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9', label: 'Slice of Life' },
    { id: 'ee968100-4191-4968-93d3-f82d72be7e46', label: 'Thriller' },
    { id: '33771934-028e-4cb3-8744-691e866a923e', label: 'Sports' },
    { id: 'b29d6a3d-1569-4e7a-8caf-7557bc92cd5d', label: 'Supernatural' },
    { id: '3b60b75c-a2d7-4860-ab56-05f391bb889c', label: 'Psychological' },
  ],
  themes: [
    { id: '2bd2e8d0-ce18-4c43-91a1-8b9ae6823f25', label: 'Harem' },
    { id: 'df33b754-73a3-4c54-80e6-1a74a8058539', label: 'Martial Arts' },
    { id: '39730448-9c03-4257-b304-0e45e8b71657', label: 'Yuri' },
    { id: 'da2d50ca-3018-4cc0-ac7a-6b7d9a9a6f22', label: 'Yaoi' },
    { id: 'eabc5b4c-6aff-42f3-b657-3e90cbd00b75', label: 'Shounen Ai' },
    { id: '3bb26d85-09d5-4d2e-880c-c34b974339e9', label: 'Shoujo Ai' },
    { id: '81183756-1453-4c81-aa9e-f6e1b63be016', label: 'Music' },
    { id: 'f5ba408b-0e7a-484d-8d49-4e9125ab9558', label: 'Reverse Harem' },
    { id: 'acc803bf-2038-44f7-b0eb-d3f576b9b7d1', label: 'Gender Bender' },
    { id: 'e64f6742-c834-471d-8d72-dd51fc02b835', label: 'Cooking' },
    { id: '0bc90acb-ccc1-44ca-a34a-b5936f7e96a4', label: 'Video Games' },
    { id: '92d6d951-ca5e-429c-ac78-451071cbf064', label: 'Office Workers' },
    { id: '0234a31e-a729-4e28-9d6a-3f87c4966b9e', label: 'Time Travel' },
    { id: '3de8c75d-8ee3-48ff-98ee-e20a65c6b91f', label: 'Aliens' },
    { id: 'caaa44eb-cd40-4177-b930-79d3ef2afe87', label: 'Animals' },
    { id: '9ab53f92-3cee-4e9b-8892-9f24c3c7bb3f', label: 'Crossdressing' },
    { id: 'b11f8d22-6e07-47a1-b2d9-9086c8b86c74', label: 'Delinquents' },
    { id: '5bd0e105-4481-44ca-b6e7-7544da56b1a3', label: 'Demons' },
    { id: '36fd93ea-e8b8-445e-b836-171e6fa13e34', label: 'Genderswap' },
    { id: 'e11f50f4-0f7b-4b7e-936e-8e4b8f2f8b2b', label: 'Ghosts' },
    { id: 'a1f53773-c69a-4ce5-8cab-fffcd90b1565', label: 'Gyaru' },
    { id: '85daba54-a71c-4554-8a28-9901a8b0afad', label: 'Incest' },
    { id: 'a1bb69db-00b8-4c19-9425-7e9f3f7fb00b', label: 'Loli' },
    { id: 'f88b3b87-9f42-44f7-8359-3e9f8598796b', label: 'Mafia' },
    { id: '65761a2b-415e-47f3-bef2-a9dababba7a7', label: 'Magic' },
    { id: 'c1e6b54f-8b8e-47f6-a8d4-8f435379e32b', label: 'Military' },
    { id: 'bb1a7473-31e8-4e7b-b78e-9a7f2f2f7c2d', label: 'Monster Girls' },
    { id: 'f2b61e89-57b0-4b06-9e6c-5f6f2f2f7e3e', label: 'Monsters' },
    { id: 'd2b61e89-57b0-4b06-9e6c-5f6f2f2f7e4f', label: 'Ninja' },
    { id: 'e3b61e89-57b0-4b06-9e6c-5f6f2f2f7e5g', label: 'Police' },
    { id: 'f4b61e89-57b0-4b06-9e6c-5f6f2f2f7e6h', label: 'Post-Apocalyptic' },
    { id: 'a5b61e89-57b0-4b06-9e6c-5f6f2f2f7e7i', label: 'Reincarnation' },
    { id: 'b6b61e89-57b0-4b06-9e6c-5f6f2f2f7e8j', label: 'Samurai' },
    { id: 'c7b61e89-57b0-4b06-9e6c-5f6f2f2f7e9k', label: 'Shota' },
    { id: 'd8b61e89-57b0-4b06-9e6c-5f6f2f2f7e0l', label: 'Survival' },
    { id: 'e9b61e89-57b0-4b06-9e6c-5f6f2f2f7e1m', label: 'Traditional Games' },
    { id: 'f0b61e89-57b0-4b06-9e6c-5f6f2f2f7e2n', label: 'Vampires' },
    { id: 'a1c61e89-57b0-4b06-9e6c-5f6f2f2f7e3o', label: 'Villainess' },
    { id: 'b2c61e89-57b0-4b06-9e6c-5f6f2f2f7e4p', label: 'Virtual Reality' },
    { id: 'c3c61e89-57b0-4b06-9e6c-5f6f2f2f7e5q', label: 'Zombies' },
    { id: 'a3c67850-4684-4761-9c58-6e6a7e781e71', label: 'Isekai' }, // Moved Isekai to themes
    { id: '51d838b2-670a-4d3f-b29e-24303f8b69e8', label: 'Magical Girls' }, // Moved Magical Girls to themes
    { id: 'c8f3b1f8-3c0e-4b9b-a6d5-7b2f9a0f2b4c', label: 'Medical' }, // Moved Medical to themes
    { id: '7b2ceab2-4e9b-4c99-b9e8-9f8f4d66e3e3', label: 'Philosophical' }, // Moved Philosophical to themes
    { id: '8c7d2b1b-4b0f-4b3e-9b27-6c4f4e8b4e7a', label: 'Superhero' }, // Moved Superhero to themes
    { id: 'd7d1730f-6eb0-4ba6-9437-602cac3860ec', label: 'Tragedy' }, // Moved Tragedy to themes
    { id: 'f4b1b2c1-4e2f-4c7b-9c4e-7e9f4c8b4f9b', label: 'Wuxia' } // Moved Wuxia to themes
  ],
  content: [
    { id: '2d1f5e56-a1e5-4d0d-a961-2193588b08ec', label: 'Gore' },
    { id: '97893a4c-12af-4dac-b6be-0dffb353568e', label: 'Sexual Violence' }
  ],
  tagModes: [ // Keeping for completeness, although not used in the filter logic
    { id: 'AND', label: 'All Tags (AND)', color: 'bg-gray-500' },
    { id: 'OR', label: 'Any Tags (OR)', color: 'bg-gray-400' }
  ],
  sortOptions: [
    { id: 'relevance', label: 'Relevance' },
    { id: 'latestUploadedChapter', label: 'Latest Upload' },
    { id: 'followedCount', label: 'Total Follows' },
    { id: 'createdAt', label: 'Creation Time' },
    { id: 'title', label: 'Manga Title' },
    { id: 'year', label: 'First Publish' },
    { id: 'minScore', label: 'Manga Rating' },
  ],
  hasChaptersOptions: [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' }
  ]
};

export default filterOptions;
