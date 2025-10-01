
        const movies = [
            { title: "Inception", genre: "Sci-Fi", year: 2010, description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O." },
            { title: "Mad Max: Fury Road", genre: "Action", year: 2015, description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search of her homeland with the aid of a group of female prisoners and a drifter named Max." },
            { title: "Dune", genre: "Sci-Fi", year: 2021, description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset, the spice, on a desert planet known as Arrakis." },
            { title: "Pulp Fiction", genre: "Drama", year: 1994, description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption." },
            { title: "Spirited Away", genre: "Fantasy", year: 2001, description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts." },
            { title: "Hidden Figures", genre: "Drama", year: 2016, description: "The story of a team of female African-American mathematicians who served a vital role in NASA during the early years of the U.S. space program." },
            { title: "Knives Out", genre: "Comedy", year: 2019, description: "A detective investigates the death of a patriarch of an eccentric, combative family." },
            { title: "Everything Everywhere All at Once", genre: "Action", year: 2022, description: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led." },
        ];

        const loader = document.getElementById('loader');
        const resultCard = document.getElementById('result-card');
        const genreSelect = document.getElementById('genre-select');
        let isProcessing = false;

       
        function base64ToArrayBuffer(base64) {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }

        async function runWithBackoff(operation, retries = 3, delay = 1000) {
            for (let i = 0; i < retries; i++) {
                try {
                    return await operation();
                } catch (error) {
                    if (i === retries - 1) {
                        throw error;
                    }
                    await new Promise(resolve => setTimeout(resolve, delay * (2 ** i)));
                }
            }
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        async function suggestMovie() {
            if (isProcessing) return;
            isProcessing = true;
         
            const selectedGenre = genreSelect.value;
            
           
            const filteredMovies = selectedGenre === 'All' 
                ? movies 
                : movies.filter(m => m.genre.includes(selectedGenre) || m.genre === selectedGenre);

            if (filteredMovies.length === 0) {
                alertUser("No results found for that cosmic trajectory.", "Please select a different genre.");
                isProcessing = false;
                return;
            }

          
            resultCard.classList.remove('is-active');
            loader.style.opacity = '1';
            loader.style.pointerEvents = 'auto';
            resultCard.style.display = 'none';

            try {
                await runWithBackoff(() => new Promise(resolve => setTimeout(resolve, getRandomInt(1500, 2500))));

                const randomIndex = getRandomInt(0, filteredMovies.length);
                const suggested = filteredMovies[randomIndex];

                document.getElementById('movie-title').textContent = suggested.title;
                document.getElementById('movie-year').textContent = suggested.year;
                document.getElementById('movie-genre').textContent = suggested.genre;
                document.getElementById('movie-description').textContent = suggested.description;

                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';

                setTimeout(() => {
                    resultCard.style.display = 'block';
                    resultCard.classList.add('is-active');
                }, 100); 

            } catch (error) {
                console.error("Cosmic Projector error:", error);
                alertUser("Transmission Error", "Could not connect to the Star Catalog. Please try again.");
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
            } finally {
                isProcessing = false;
            }
        }

        function alertUser(title, message) {
            const overlay = document.createElement('div');
            overlay.className = "fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50";
            overlay.innerHTML = `
                <div class="bg-gray-900 p-8 rounded-xl shadow-2xl border-2 border-red-500 max-w-sm w-full text-center transform scale-0 transition-all duration-300" id="alert-box">
                    <h3 class="text-2xl font-bold text-red-400 mb-3">${title}</h3>
                    <p class="text-gray-300 mb-6">${message}</p>
                    <button class="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg" onclick="document.body.removeChild(this.closest('.fixed'))">
                        Acknowledge
                    </button>
                </div>
            `;
            document.body.appendChild(overlay);
            setTimeout(() => {
                document.getElementById('alert-box').classList.remove('scale-0');
            }, 10);
        }

        function generateStarField(count = 150) {
            const container = document.getElementById('star-field');
            const w = window.innerWidth;
            const h = window.innerHeight;

            for (let i = 0; i < count; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                const size = Math.random() * 3 + 0.5; 
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.top = `${Math.random() * h}px`;
                star.style.left = `${Math.random() * w}px`;
                star.style.animationDuration = `${Math.random() * 3 + 1}s`; 
                star.style.animationDelay = `${Math.random() * 5}s`;
                container.appendChild(star);
            }
        }
        window.onload = generateStarField;

