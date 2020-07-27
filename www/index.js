'use strict';

const ENDPOINT_URL = 'https://akxdricpcf.execute-api.eu-west-1.amazonaws.com';

let clearLog = () => {
	$('#debug').html('');
};

let log = (msg) => {
	$('#debug').append(`<p>&gt; ${msg}</p>`);
	console.log(msg);
};

let createValidationJob = (data) => {
	let promise = new Promise((resolve, reject) => {
		$.ajax(
			ENDPOINT_URL + '/validation_jobs',
			{
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(data),
				success: (data) => {
					resolve(JSON.parse(data));
				},
				error: (e) => {
					log('Request failed!');
					reject(e);
				}
			}
		);
	});

	return promise;
};

let getExecutionStatus = (arn) => {
	let promise = new Promise((resolve, reject) => {
		$.ajax(
			ENDPOINT_URL + '/validation_jobs',
			{
				method: 'GET',
				data: {
					executionArn: arn
				},
				success: (data) => {
					resolve(JSON.parse(data));
				},
				error: (e) => {
					reject(e);
				}
			}
		)
	});
	return promise;
};

let waitForExecutionCompletion = (arn) => {
	let promise = new Promise((resolve, reject) => {
		let intervalId = window.setInterval(
			() => {
				getExecutionStatus(arn)
					.then((data) => {
						if (data.status === 'FAILED') {
							window.clearInterval(intervalId);
							reject(data.status);
						} else if (data.status === 'SUCCEEDED') {
							window.clearInterval(intervalId);
							resolve(data);
						}
					})
					.catch(() => {
						log('API request failed');
						window.clearInterval(intervalId);
						reject('API request failed');
					});
			},
			2000
		);
	});
	return promise;
};

let getUploadUrls = () => {
	let promise = new Promise((resolve, reject) => {
		$.ajax(
			ENDPOINT_URL + '/upload_urls',
			{
				method: 'GET',
				success: (data) => {
					resolve(JSON.parse(data));
				},
				error: (e) => {
					reject(e);
				}
			}
		)
	});
	return promise;
};

let uploadPhotos = (urls) => {
	let promises = [];
	let fields = ['GovIdCardPicture', 'FacePicture'];

	for (let i = 0; i < urls.length; i++) {
		let url = urls[i];
		let field = fields[i];

		// Set the S3 keys in the relevant fields
		$(`#${field}Key`).val(url.fields.key);

		let data = new FormData();
		Object.entries(url.fields).forEach(el => {data.append(el[0], el[1])});
		data.append('file', $(`#${field}`)[0].files[0]);

		let promise = new Promise((resolve, reject) => {
			$.ajax(
				url.url,
				{
					// As per https://stopbyte.com/t/how-to-sending-multipart-formdata-with-jquery-ajax/58/2
					method: 'POST',
					data: data,
					cache: false,
					contentType: false,
					processData: false,
					success: (data) => {
						resolve(data);
					},
					error: (e) => {
						reject(e);
					}
				}
			)
		});
		promises.push(promise);
	}

	return Promise.all(promises);
};

let submitForm = (event) => {
	event.preventDefault();

	clearLog();
	log('Requesting pre-signed S3 upload URLs...');

	getUploadUrls()
		.then((d) => {
			$('#Bucket').val(d.bucket);
			return d;
		})
		.then((d) => {
			log('Uploading photos...');
			return uploadPhotos(d.urls);
		})
		.then(() => {
			let data = {
				Bucket: $('#Bucket').val(),
				GovIdCardPictureKey: $('#GovIdCardPictureKey').val(),
				FacePictureKey: $('#FacePictureKey').val(),
				GovIdCardData: {
					FirstName: $('#FirstName').val(),
					LastName: $('#LastName').val(),
					Id: $('#Id').val()
				}
			};

			log('Creating validation job...');
			return createValidationJob(data);
		})
		.then((d) => {
			log('Awaiting job completion...');
			return waitForExecutionCompletion(d.executionArn);
		})
		.then(() => {
			log('Goverment ID has been validated! Yaay!');
		})
		.catch((reason) => {
			console.error(reason);
			log('Validation has failed for some reason.');
		});
};

window.onload = () => {
	let form = document.getElementById('form');
	form.addEventListener('submit', submitForm, true);

	// Ensure that selected file names appear on the textboxes next to the
	// file inputs.
	let fileInputs = document.querySelectorAll('input[type=file]');
	fileInputs.forEach((input) => {
		input.onchange = () => {
			if (input.files.length > 0) {
				let fileName = Array.from(input.parentNode.childNodes.values()).find((el) => {
					return el.className === 'file-name';
				});
				fileName.textContent = input.files[0].name;
			}
		};
	});

	log('Waiting for stuff to happen.');
};
