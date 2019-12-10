//populate data with information from database API
var data_array = [
		{linkimg:"https://pbs.twimg.com/media/D7OHWHmWsAAuTW6.jpg" ,name: "StarRes", description: "StarRes contains student information. Use it to look up students when writing Incident Reports.", link: "https://hdsapps.colorado.edu/starrezweb"},
		{linkimg:"https://www.stetson.edu/law/conferences/highered/home/media/maxient%20logo%202.jpg" ,name: "Internal Incident Report", description: "Incident Reports are where you document policy violations or medical emergancies that happen in the resident halls. This internal link should not be shared outside of this page.", link: "https://rareport.wufoo.com/forms/qoxs6r0pdko5i/"},
		{linkimg:"https://static-assets.technologyevaluation.com/SoftwareImages/0/20/20EF04D66A6A29D3C6F4EC7A2AC18B8B1704BE87/logo.png" ,name: "Duty Rounds", description: "On the Duty Rounds form log with your duty partner what happened during each duty night. This form varies by dorm.", link: "https://rareport.wufoo.com/forms/qoxs6r0pdko5i/"},
		{linkimg:"https://i0.wp.com/blog.roompact.com/wp-content/uploads/2019/07/397b5-roompact-highrez.png?resize=1024%2C213" ,name: "Roompact", description: "Roompact is used for Roommate Agreements and for notifying your Hall Director on roommate conflicts.", link: "https://roompact.com/users/login"},
		{linkimg:"https://www.appliedis.com/wp-content/uploads/2019/04/microsoftpowerapps-300x150.png" ,name: "BuffChats", description: "The BuffChats app provided through powerapps allows for the input and tracking of each resident BuffChat.", link: "https://apps.powerapps.com/play/3aed8dcf-4a6f-4393-928e-d8aff57873e3?source=portal&screenColor=rgba(81%2C%2092%2C%20107%2C%201)"},
		{linkimg:"https://www.colorado.edu/umc/sites/default/files/block/cds_center.jpg" ,name: "My CU Living", description: "The My CU Living site is a hub for room and meal plan management. It is also used by the resident to check in overnight guests.", link: "living.colorado.edu"},
		{linkimg:"https://img.over-blog-kiwi.com/2/41/57/84/20170618/ob_bb666d_whentowork-logo-blue.png" ,name: "When to Work", description: "When to work is the site used to organize the desk. Use this site to post your available hours, ask for trades, and communicate with your coworkers.", link: "https://whentowork.com/"},
		{linkimg:"../resources/img/cu_600_300.png" ,name: "Community Center Site", description: "The Community Center Site is used at the community center desk for the tracking of temporary keys and logging desk shifts.", link: "https://communitycenter.colorado.edu/"}
]


function updatePage() {

	// empty staff array
	while (data_array.length > 0) {
		data_array.pop();
	}

	// create new request
	var request = new XMLHttpRequest();

	// update staff array and page once requested info is loaded
	request.onload = function () {
		console.log("Server has responded with info.");

		var req_data_array = request.response.data;

		if (req_data_array.length == 0)
		{
			console.log("No resource info available.")
		}
		else
		{
			for (i = 0; i < req_data_array.length; i++)
			{
				data_array.push(req_data_array[i]);
			}
		}

		// removeCards();
		fillResources();
	}

	// configure request
	request.open("POST", "/resourcepage.html");
	request.setRequestHeader("Content-Type", "application/json");
	request.responseType = 'json';

	// send request to server
	request.send(); //JSON.stringify({hall : hallName})
	console.log("Requesting info.");
}

// function removeCards ()
// {
// 	var container = document.getElementById("card-container");
//
// 	while (container.firstChild)
// 	{
// 		container.removeChild(container.firstChild);
// 	}
// }

function fillResources()
{

	data_array.forEach(resource => {

		var card = document.createElement("div");
				card.classList = "card";
				//newCard.classList.add("card", "bg-dark");
				card.style.width = "20rem";
				card.style.margin = "1rem";
				card.style.display = "inline-block";

		var image = document.createElement("img");
				image.classList = "card-img-top";
				image.src = resource.linkimg;
				image.alt = "Card image"
		card.appendChild(image);

			var cardBody = document.createElement("div");
					cardBody.classList = "card-body";

					var header = document.createElement("h5");                       // Create a <h5> element
							header.classList = "card-title";
							var name = document.createTextNode( resource.name );
							header.appendChild(name);
					cardBody.appendChild(header);

					var text = document.createElement("p");                       // Create a <p> element
							text.classList = "card-text";
							var discription = document.createTextNode( resource.description );
							text.appendChild(discription);
					cardBody.appendChild(text);

					var link = document.createElement("a");                       // Create a <p> element
							link.classList = "btn btn-primary";
							link.innerHTML = "Go There";
							link.href =  resource.link;
					cardBody.appendChild(link);

			card.appendChild(cardBody);


		var container = document.querySelector("#container");
		container.appendChild(card);
	});
}
