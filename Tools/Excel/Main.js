const excelFileRegex = /^.*\.xls[xm]$/gi;
		const excelWorksheetRegex = /^xl\/worksheets\/.*.xml$/gi;
		
		var outputZip;
		var outputZipFilename = "default-filename.error.zip";
		var filesTotalCount = 0;
		var filesProcessedCount = 0;
		var passwordsRemoved = 0;
		
		function acceptTerms() {
			document.getElementById("warning").hidden = true;
			document.getElementById("file-select").hidden = false;
		}
		
		function selectFile() {
			document.getElementById("input-file").click();
			fileSelectionHandler();
		}
		
		/* Waits for a file to be selected */
		function fileSelectionHandler() {
			if(document.getElementById("input-file").files.length == 0) {
				setTimeout(fileSelectionHandler, 500);
				return;
			} else if(document.getElementById("input-file").files.length > 1) {
				handleError("You selected more than one file !");
			} else {
				//console.log(document.getElementById("input-file").files[0].name);
				if(document.getElementById("input-file").files[0].name.match(excelFileRegex)) {
					document.getElementById("file-select").hidden = true;
					document.getElementById("file-confirm-text").textContent = "Tài liệu của bạn là: \""+document.getElementById("input-file").files[0].name+"\", đúng không ?";
					document.getElementById("file-confirm").hidden = false;
				} else {
					handleError("Tệp bạn đã chọn có vẻ không phải là tệp Excel!");
				}
			}
		}
		
		function handleError(errorMessage) {
			// Hiding everything
			document.getElementById("warning").hidden = true;
			document.getElementById("file-select").hidden = true;
			document.getElementById("file-confirm").hidden = true;
			document.getElementById("file-process-waiting").hidden = true;
			document.getElementById("file-process-finished").hidden = true;
			document.getElementById("end").hidden = true;
			
			// Preparing and showing error message
			document.getElementById("error-text").textContent = errorMessage;
			document.getElementById("error").hidden = false;
		}
		
		function restart() {
			location.reload();
		}
		
		function startProcessing() {
			document.getElementById("file-confirm").hidden = true;
			document.getElementById("file-process-waiting").hidden = false;
			// Done this way so as to not block the rendering of the "Please wait text".
			setTimeout(processFile, 100);
		}
		
		function processFile() {
			outputZipFilename = document.getElementById('input-file').files[0].name;
			outputZipExtension = "."+outputZipFilename.split(".").pop();
			outputZipFilename = outputZipFilename.substring(0, outputZipFilename.length - outputZipExtension.length);
			outputZipFilename =  "ChesinoTools_" + outputZipFilename  + outputZipExtension;
		
			JSZip.loadAsync(document.getElementById('input-file').files[0]).then(function(zip) {
				outputZip = new JSZip();
				filesTotalCount = 0;
				filesProcessedCount = 0;
				passwordsRemoved = 0;
				
				for(const[fileKey, fileValue] of Object.entries(zip.files)) {
					filesTotalCount++;
					
					if(fileKey.match(excelWorksheetRegex)) {
						//console.debug("Checking: "+fileKey);
						fileValue.async("string").then(function(fileText) {
							var startIndex = fileText.indexOf('<sheetProtection ');
							
							if(startIndex === -1) {
								// No password found.
								outputZip.file(fileKey, fileText);
								//console.debug("Analysed: "+fileKey);
							} else {
								// Removing the password.
								var endIndex = fileText.indexOf('/>', startIndex) + 2;
								fileText = fileText.replace(fileText.substr(startIndex, endIndex-startIndex), "");
								outputZip.file(fileKey, fileText);
								//console.debug("Processed: "+fileKey);
								passwordsRemoved++;
							}
							
							filesProcessedCount++;
						});
					} else {
						// Other files.
						//console.debug("Ignoring: "+fileKey);
						fileValue.async("string").then(function(fileText) {
							outputZip.file(fileKey, fileText);
							//console.debug("Copied: "+fileKey);
							filesProcessedCount++;
						});
					}
				}
				
				//console.debug("Waiting for all the files to be processed !");
				setTimeout(waitFilesBeingProcessed, 50);
			}, function (e) {
				handleError("Failed to extract the content of the file in the browser ! ("+e.message+")");
			});
		}
		
		function waitFilesBeingProcessed() {
			//console.debug("Processed "+filesProcessedCount+" file(s) out of "+filesTotalCount);
			
			if(filesTotalCount != filesProcessedCount) {
				setTimeout(waitFilesBeingProcessed, 50);
			} else {
				//console.debug("Done, now switching the page !");
				if(passwordsRemoved > 0) {
					console.log(passwordsRemoved);
					document.getElementById("file-process-waiting").hidden = true;
					document.getElementById("file-process-finished-text").textContent = "Đã tìm thấy "+passwordsRemoved+" mật khẩu trong tệp !";
					document.getElementById("file-process-finished").hidden = false;
				} else {
					handleError("Tài liệu này không có mật khẩu!");
				}
			}
		}
		
		function downloadProcessedFile() {
			outputZip.generateAsync({type:"base64"}).then(function(base64) {
				link = document.getElementById("zip-downloader-tag")
    			link.download = outputZipFilename;
    			link.href = 'data:application/zip;base64,' + base64;
    			link.click();
				document.getElementById("file-process-finished").hidden = true;
				document.getElementById("end").hidden = false;
			}, function(err) {
				console.error(err);
				handleError("An error has occured while generating your file, please check the console for more info !");
			});
		}