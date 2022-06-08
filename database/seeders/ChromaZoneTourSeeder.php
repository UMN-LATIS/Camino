<?php

namespace Database\Seeders;

use App\Stop;
use Illuminate\Database\Seeder;
use App\Tour;
use MatanYadaev\EloquentSpatial\Objects\Point;



class ChromaZoneTourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $tour = Tour::create([
            'active' => 1,
            'public' => 1,
            'title' => 'Chroma Zone Mural Tour',
            'tour_content' => json_decode('{"hotWords": [], "languages": ["English"], "use_template": true, "custom_base_map": {"image": null, "coords": {"upperleft": {"lat": null, "lng": null}, "lowerright": {"lat": null, "lng": null}}, "use_basemap": false}}'),
            'start_location' => new Point(44.96231, -93.19157),
            'created_at' => '2020-05-18 19:45:47',
            'updated_at' => '2020-07-01 13:44:43',
            'deleted_at' => NULL,
            'geocoded' => NULL,
            'template' => 0,
            'driving' => 0,
            'biking' => 1,
            'walking' => 1,
            'style' => 'entire_tour',
        ]);

        $stops = [
            [
                'stop_content' => json_decode('{"title": {"English": "Start", "placeholder": null}, "subtitle": null, "stages": [{"type": "language"}, {"text": {"English": "Welcome to this tour of St. Paul\'s Chroma Zone mural art. You\'ll be visiting 12 pieces of art created in the fall of 2019, painted by artists from around the world. This tour will take about an hour and covers just under 4 miles. You\'ll start out at Budget Sign Shop (2474 W Territorial Rd), just across the street from South St. Anthony Park.  You\'ll send just across University Avenue.\\n\\nUse the \\"next\\" button in the upper right to move to the next stop. Each stop will include navigation instructions, as well as informational material.\\n\\nAs you move through your tour, you might come across \\"hotwords\\". These are underlined words that you can tap to mark. At the end of your tour, we\'ll give you a list of the words you marked, with additional information so you can dive deeper.\\n\\nIf you\'d like a sneak peak of the murals and the process behind them, check out the 1 minute video below.", "placeholder": null}, "type": "guide"}, {"url": null, "type": "embed-frame", "source": "https://www.youtube.com/embed/-lpew3SAFAo", "buttonTitle": {"English": "Show Video"}}, {"text": {"placeholder": null}, "type": "navigation", "route": [{"lat": 44.96656, "lng": -93.20013}], "buttonTitle": {"English": "Tour Preview"}, "targetPoint": {"lat": 44.96656, "lng": -93.20013}}]}'),
                'sort_order' => 0,
            ], [
                'stop_content' => json_decode('{"title": {"English": "Finish", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "You\'ve made it to the end of the tour. We hope you enjoyed this experience. Please leave us some feedback. Chroma Zone will continue to grow and expand.  Take a look at the [Chroma Zone website](https://www.chromazone.net/ \\"Chroma Zone website\\") for more information.", "placeholder": null}, "type": "guide"}, {"text": {"placeholder": null}, "type": "feedback"}, {"text": {"English": "Hotwords"}, "type": "separator"}, {"text": {"English": "Enter your email below to have a copy of this content emailed to you.", "placeholder": null}, "type": "hotwords-summary", "request_email": true}]}'),
                'sort_order' => 13,
            ],
            array(
                'stop_content' => json_decode('{"title": {"English": "Priscila De Carvalho", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "This first piece is on the west side of Budget Sign Shop, just across the street from South St. Anthony Park.\\n\\nYou might be familiar with the neighborhood of St. Anthony Park, just to the north. South St. Anthony Park was originally built as housing for the railroad workers, who served the bustling nearby rail hubs.", "placeholder": null}, "type": "navigation", "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96656, "lng": -93.20014}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "Priscila De Carvalho is a Brazilian-American contemporary artist who is known for paintings, sculptures, murals, site-specific installations, and permanent public art.\\n\\nShe is a recipient of The Pollock-Krasner Foundation Fellowship Award and served as an artist in residence at Sculpture Space, Aljira Emerge 10 Fellowship, Lower East Side Printshop, The Bronx Museum of the Arts and Jamaica Center for the Arts and Learning Workspace Program. She made her first solo debut with Passageways in the Jersey City Museum, opening March 19, 2009.\\n\\nPriscila’s work has been exhibited by the Brooklyn Bridge Park (New York, USA), The Bronx Museum of the Arts (New York, USA), Socrates Sculpture Park (New York, USA), the Basque Museum-Center of Contemporary Art (Vitoria-Gasteiz, Spain), Deutsche Bank (New York, USA), the Grand Palais (Paris, France), the Nepal Art Council in (Kathmandu, Nepal), The Museum of Contemporary African Diasporan Arts (New York, USA), The Jersey City Museum (Jersey City, USA). She was also a celebrated participant in El Museo’ Sixth Biennial in New York City, The First AIM Biennial at The Bronx Museum of the Arts, and The Kathmandu International Triennial in Nepal where she represented her home nation of Brazil. \\n\\nShe has been commissioned for large-scale permanent public art projects by the MTA Arts & Design and the Department of Education in NY in collaboration with School Construction Authority, she is currently creating permanent public artwork for the SBS Woodhaven median stations commissioned by New York City’s Department of Cultural Affairs’ Percent for Arts Program as well as her largest and most ambitious sculptural work to date for the Valley Metro Rail System in Phoenix, Arizona. Priscila lives and works in Long Island City, NY.", "placeholder": null}, "type": "guide"}, {"type": "gallery", "images": [{"src": "hE1h1B1DsmREtUHhHMWVLHEi1nsPvvdaJYPsw5ow.jpg", "text": {"English": "Priscila De Carvalho", "placeholder": null}}]}]}'),
                'sort_order' => 1,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "“Love” by Cey Adams", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Head across the street to the park. Take the trail to the right of the tennis courts, which cuts across the park and exits at Bayless Street. Turn right at St. Cecilias Church and stay right at the fork (Bayless Place) until it runs into Raymond. The next mural is on the north side of Hampden Park Co-op (just across the street). It\'s about 1/4 of a mile.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.96656, "lng": -93.20014}, {"lat": 44.968183457610124, "lng": -93.20069074630737}, {"lat": 44.968562988571215, "lng": -93.2000255584717}, {"lat": 44.96880588706839, "lng": -93.19948911666873}, {"lat": 44.968654075628194, "lng": -93.19854497909549}, {"lat": 44.96922, "lng": -93.19764}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96922, "lng": -93.19764}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "[Cey Adams](https://www.instagram.com/ceyadams/?hl=en \\"Cey Adams\\"), a New York City native, emerged from the downtown graffiti movement to exhibit alongside fellow artists Jean-Michel Basquiat and Keith Haring. Today his art practice consists of working with mixed media materials to create large collage paintings, works on paper and bright colorful murals. Recent collaboration partners include the Smithsonian, Temple University, IDEO, Apple, Levi’s, Converse, Pabst Blue Ribbon, Foot Locker, YouTube, and Google.", "placeholder": null}, "type": "guide"}, {"type": "gallery", "images": [{"src": "2czEW9pmY6HuO9zPv6OvOh5e0X0Sbsa8hGT6Narr.jpg", "text": {"English": "Cey Adams", "placeholder": null}}]}]}'),
                'sort_order' => 2,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Mariela Ajras", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Head back to Wycliff and turn right. Continue for a few hundred feet until you see the piece on your right. If you pass the big Wycliff sign, you\'ve gone too far - keep your eyes peeled, it\'ll be over your right shoulder!", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.9685, "lng": -93.19535}, {"lat": 44.969048784536966, "lng": -93.19483280181885}, {"lat": 44.96975, "lng": -93.19561}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96975, "lng": -93.19561}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "Mariela Ajras (Buenos Aires, 1984) is an internationally-acclaimed muralist from Buenos Aires, Argentina. Her work mainly focuses on the images of women and questions of femininity and collective memory. A psychologist as well as an artist, this background greatly influences her work in terms of subject matter and also in the teaching of community-oriented workshop that uses muralism as a social tool. She is a founding member of AMMURA (Association of Female Muralists of Argentina), a platform that showcases female muralists work and calls out gender inequality in the public art scene in Argentina. Her work can be found in different cities such as Los Angeles, CA, Oakland, Lynn, MA, Salem, MA. Barcelona, Valencia, Tarragona, Salamanca in Spain. Mexico City, Guadalajara, Morelia, Ciudad Juarez in Mexico. Napoli in Italy, Buenos Aires in Argentina, Louvain in Belgium among others.", "placeholder": null}, "type": "guide"}]}'),
                'sort_order' => 4,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Claudia Valentino", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Head east on Hampden and then take a left on Bradford. Continue across Wycliff. The piece is on the side of the Precision Coatings building. This is about 1/5 mile.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.96922, "lng": -93.19764}, {"lat": 44.968183457610124, "lng": -93.19562673568728}, {"lat": 44.9685, "lng": -93.19535}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.9685, "lng": -93.19535}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "Claudia Valentino (Clau) came from Argentina to Minneapolis in 2009 and started working with Greta McLain in 2011. In Argentina, she spent three years studying expression. corporal, a contemporary dance technique that expresses emotions through body movements, at the National University Institute of Art (IUNA) in Buenos Aires, and documentary photography at the Association of Argentine Graphic Reporters (ARGRA). She learned the craft of painting and mosaics with Greta and started working as a project leader in 2014 at Goodspace murals company. There she learned many techniques focused more than anything on over and under painting. She also found the beautiful challenge of working with the community and that is one of the things she likes most about her profession. She developed as a muralist for 7-8 years together with several community projects.", "placeholder": null}, "type": "guide"}, {"type": "gallery", "images": [{"src": "GqIbIpabdxglZcmIeJP92zIDxHFReAVg9HNwBU60.jpg", "text": {"English": "Claudia Valentino (right) and Daniela Bianchini", "placeholder": null}}]}]}'),
                'sort_order' => 3,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Fadlabi", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Continue along Wycliff. The next piece is on the north side of the same building. Turn into the parking lot and go past the big green garage doors.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.96975, "lng": -93.19561}, {"lat": 44.96979265163572, "lng": -93.19592714309694}, {"lat": 44.97020253346561, "lng": -93.196120262146}, {"lat": 44.97054, "lng": -93.1955}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.97054, "lng": -93.1955}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "Fadlabi (b. 1975 in Omdurman) lives and works in Oslo. He was educated at the Art Academy in Oslo (KHiO), Al-Neelain University in Khartoum, and Sudan University. He works with painting, text, and performance. In 2008 he founded “One Night Only” an artist-run platform in Oslo that shows a new artist every Monday. Possibly, Norway\'s most busy gallery. Between 2010- 2014 he worked with artist Lars Cuzner on European Attraction Limited, a contemporary rendition of a human zoo named The Congo Village and was part of the 1914 World Fair in Oslo. They re-enacted the village and opened it to the public in May 2014. His recent shows includes Sharjah Biennial 11 (Sharjah), Bergen Assembly (Bergen)The Museum of Contemporary Art (Oslo), Kunsthall (Oslo), UKS (Oslo), Munchmuseet i bevegelse (Oslo), NY Art-book fair (NY),Performa 15 NY (NY), Temporary Gallery (Cologne), Nile Sunset Annex (Cairo), Al Riwaq (Manamah), the Saudi Arts Council (Jeddah), Darat Al Funun (Amman) and Townhouse (Cairo).", "placeholder": null}, "type": "guide"}, {"type": "gallery", "images": [{"src": "eI2gwx0eOkNHhOlZkfI7Xhek0YiHAQqtd6IFsWTE.jpg", "text": {"English": "Fadlabi", "placeholder": null}}]}]}'),
                'sort_order' => 5,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Chuck U", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Retrace your steps along Wycliff and continue across Bradford. keep going along Wycliff. The next piece is on your right, at the Spot Weld building. It\'s about 1/3 of a mile.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.97054, "lng": -93.1955}, {"lat": 44.970126629644035, "lng": -93.19605588912962}, {"lat": 44.969549757317296, "lng": -93.19573402404787}, {"lat": 44.96829, "lng": -93.19346}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96829, "lng": -93.19346}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "Chuck U is an Artist and Illustrator living and working in Minneapolis. He mostly prefers working in pen and ink and doing smaller scale print work, but has recently been branching out into larger paintings and murals. You can see his work on Indeed brew cans, the sides of buildings, album covers, the walls of print collectors all over the world and once even a lottery ticket.", "placeholder": null}, "type": "guide"}]}'),
                'sort_order' => 6,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Biafra, Inc", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Continue along Wycliff until the intersection, then take a right. The next piece is about a block down - it\'s hard to miss! it\'s about 1/5 of a mile.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.96829, "lng": -93.19346}, {"lat": 44.96789501240019, "lng": -93.19247245788576}, {"lat": 44.96673, "lng": -93.19219}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96673, "lng": -93.19219}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "Biafra hadn\'t planned on being an artist. He thought he was going to be a teacher. He started cutting stencils as a way to decorate his skateboard in 2003. Cutting stencils quickly turned into an obsession, suddenly the stencils were on stickers and walls and that transitioned into an interest in graffiti and screen printing. He switched my major from education to art and received a B.F.A. with an emphasis in printmaking from the University of Minnesota Twin Cities. He has been lucky enough to take what he has learned and obsessed about for all these years and turn that into a job. His work is text heavy and hard lines. He uses comic book characters because he thinks they are instantly relatable to every generation and represent an idealistic time. The text surrounding the characters gives clues as to what the character represents. The bold lines and bright colors associated graffiti and street art still stick with him. He uses his murals as an extension of his fine art. He can do a print and a mural of the same character and each application allows me to explore the character and themes in a different way. The scale of a mural can deliver a feeling that the intimacy of a print can\'t and he loves exploring that experience.", "placeholder": null}, "type": "guide"}, {"type": "gallery", "images": [{"src": "Otd4QdKOKCohWRMOsOC24va8T8JPl7dCfI3ooaNg.jpg", "text": {"English": "Biafra, Inc", "placeholder": null}}]}]}'),
                'sort_order' => 7,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Ewok", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Continue south down the same steet. Take your first left on Territorial, and then your first left onto Vandalia. Continue past Ellis. The next piece is on your right, just past the Tech Dump. It\'s just over half a mile.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.96673, "lng": -93.19219}, {"lat": 44.96453983261074, "lng": -93.19240808486937}, {"lat": 44.96384144472197, "lng": -93.1890821456909}, {"lat": 44.96602767410954, "lng": -93.18901777267456}, {"lat": 44.96644, "lng": -93.18878}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96644, "lng": -93.18878}}, {"text": {"English": "Guide"}, "type": "separator"}, {"text": {"English": "Ewok is an Orange County based artist who began writing graffiti in Minneapolis in the early 90’s. Since then, he has solidified his status as an internationally known Graffiti artist, traveling extensively and painting in several countries, including exhibiting artwork and mural projects with the Seventh Letter artist collective, in Los Angeles, Tokyo, Taiwan, Barcelona, and Seoul. More recently Ewok was one of several artists who completed Guinness Book of World Records’ longest continuous graffiti scroll in Dubai that was part of their UAE day celebration. His fine art has been exhibited at LA’s Known gallery, and his solo exhibitions ‘Revisionist History\' and ‘Pageantry’ have been featured on Hypebeast and in Juxtapoz magazine.", "placeholder": null}, "type": "guide"}, {"type": "gallery", "images": [{"src": "EUTprB3KS0uBkUldn7Z0Xb5tMv4cQV3EsuPW48lO.jpg", "text": {"English": "Ewok", "placeholder": null}}]}]}'),
                'sort_order' => 8,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Eric Garcia", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "This next piece isn\'t easy to get to on foot. If you\'re walking or would rather not bike on busier streets, you can skip to the next step and instead head south on Vandalia to Charles Ave. \\n\\nIf you\'re on a bike, head back the way you came and take a left on Ellis.  When you get to Transfer road, cross the street and then turn left and follow the bike lane.  Transfer road will curve around and intersect Prior. Turn right on Prior and continue a few hundred feet to find the next piece. It\'s just over half a mile.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.96644, "lng": -93.18878}, {"lat": 44.966042855966776, "lng": -93.18893194198607}, {"lat": 44.96610358335547, "lng": -93.18575620651245}, {"lat": 44.96731811762877, "lng": -93.18573474884032}, {"lat": 44.967834286908, "lng": -93.18521976470947}, {"lat": 44.96874516254054, "lng": -93.18350315093997}, {"lat": 44.968760343678525, "lng": -93.18230152130127}, {"lat": 44.96776, "lng": -93.18243}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96776, "lng": -93.18243}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "Known for mixing history with contemporary politics, Eric J. Garcia always tries to create art that is much more than just aesthetics.  Garcia has been creating murals for over a decade, from Albuquerque to Chicago. His murals have been commissioned by such institutions as The National Museum of Mexican Art, the Urban Institute Contemporary Art and DePaul Art Museum.  Garcia received his BFA with a minor in Chicano studies from the University of New Mexico, and went on to completed his MFA from the School of the Art Institute of Chicago. A versatile artist working not only with murals but in an assortment of media, from hand-printed posters, to sculptural installations, to his controversial political cartoon series El Machete Illustrated, they all have a common goal of educating and challenging.", "placeholder": null}, "type": "guide"}, {"type": "gallery", "images": [{"src": "RkCdW8iq82gsxI1hYg3GrKtrd0HP3Z99658j5Wjv.jpg", "text": {"English": "Eric J. Garcia", "placeholder": null}}]}]}'),
                'sort_order' => 9,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Martzia Thometz", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Continue along Prior all the way to University Avenue. Along the way, you\'ll pass Can Can Wonderland, home to the fanciest mini golf course you\'ve ever seen!\\n\\nAt University Avenue, turn right (stick to the sidewalk) and continue two (long) blocks to Vandalia, then turn right - the piece is immediately on your right. There\'s a second piece just a little further down. This ride is about a mile.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.96776, "lng": -93.18243}, {"lat": 44.957889620382986, "lng": -93.18215131759646}, {"lat": 44.960850426503285, "lng": -93.18961858749388}, {"lat": 44.96155, "lng": -93.18895}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96155, "lng": -93.18895}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "Martzia began painting the streets in 2008. With a foundation in graffiti she learned to paint fast and efficiently, often traveling around to new and foreign environments. Self-taught she is continuously pushing herself to learn and grow as an artist. Over the years she’s developed a distinct recognizable style, built around imagery of strong women often ready for the everyday battle of being feminine in a male dominated society. Her goal is to make accessible art to empower young (and old) angry women to see the strength and beauty within themselves.", "placeholder": null}, "type": "guide"}]}'),
                'sort_order' => 10,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Christina Vang + Teeko Yang + Oskar Ly", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Continue on Vandalia and turn left on Charles. Continue for three blocks, crossing Carleton. The next piece is in the first alley on the left. It\'s about 1/5 of a mile.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.96155, "lng": -93.18895}, {"lat": 44.961806961979974, "lng": -93.1890821456909}, {"lat": 44.96426655140595, "lng": -93.19534778594972}, {"lat": 44.96436, "lng": -93.19586}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96436, "lng": -93.19586}}, {"text": {"English": "About the Artists"}, "type": "separator"}, {"text": {"English": "ArtCrop is a collective of Hmong artists whose work explores and reconnects to their cultural roots. Located in the Creative Enterprise Zone, ArtCrop is pleased to join the roster of artists featured in Chroma Zone. ArtCrop has created murals from downtown Saint Paul to rural farm landscapes leaving evidence to spark the next generation’s own love stories of culture and identity. Their work pushes Hmong aesthetics and cultural innovation influenced by their people across a global diaspora. The ArtCrop artists include Christina Vang, Oskar Ly and Teeko Yang.  Christina Vang is a multi-faceted designer and artist whose work focuses on community narratives. Through her work she captures the vibrancy, curiosity, and energy of cultural communities. Oskar Ly is a queer Hmong French American artist. Her work focuses on creating new possibilities that reclaim identity through fashion art along with organizing community productions that uplift cultural preservation/re-appropriation. Teeko Yang is a project manager by day and a creative by night. She is a purpose-driven photographer interested in capturing the truth of her subjects.", "placeholder": null}, "type": "guide"}, {"type": "gallery", "images": [{"src": "4IzuPipTFC5JRbzGQtbu2VZpJIqUUITmcnNPrg5v.jpg", "text": {"placeholder": null}}]}]}'),
                'sort_order' => 11,
            ),
            array(
                'stop_content' => json_decode('{"title": {"English": "Mr. Kiji", "placeholder": null}, "subtitle": null, "stages": [{"text": {"English": "Navigation"}, "type": "separator"}, {"text": {"English": "Follow the alley to University Avenue. Turn right on University, and then left at Raymond and follow Raymond. This piece is at the first intersection (Myrtle), above the Dual Citizen patio. It\'s about 1/4 mile.", "placeholder": null}, "type": "navigation", "route": [{"lat": 44.96436, "lng": -93.19586}, {"lat": 44.963568160190256, "lng": -93.19648504257204}, {"lat": 44.96403881607414, "lng": -93.19751501083377}, {"lat": 44.96303676987407, "lng": -93.19755792617799}, {"lat": 44.96305, "lng": -93.1979}], "buttonTitle": {"English": "Show Map"}, "targetPoint": {"lat": 44.96305, "lng": -93.1979}}, {"text": {"English": "About the Artist"}, "type": "separator"}, {"text": {"English": "A Japanese-born, New York City-based artist whose work encompasses animations, murals of scale, product and packaging design. He\'s recognized for playful and bold graphic and pattern work with a strong emphasis on color.", "placeholder": null}, "type": "guide"}, {"type": "gallery", "images": [{"src": "4PP0EtMxyg5rUv5FN8Y31186BHRM3AqgBSRHQx4o.jpg", "text": {"English": "Mr. Kiji", "placeholder": null}}]}]}', JSON_FORCE_OBJECT),
                'sort_order' => 12,
            ),
        ];

        collect($stops)->each(function ($stopProps) use ($tour) {
            $stop = new Stop($stopProps);
            $tour->stops()->save($stop);
        });
    }
}
