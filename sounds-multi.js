/********************************************************************************

	SYNCER 銆� 鐭ヨ瓨銆佹劅鍕曘倰銇裤倱銇仺鍚屾湡(Sync)銇欍倠銉栥儹銈�

	* 閰嶅竷鍫存墍
	https://syncer.jp/html5-javascript-hello-button

	* 鏈€绲傛洿鏂版棩鏅�
	2015/09/11 18:08

	* 浣滆€�
	銇傘倝銈�

	** 閫ｇ怠鍏�
	Twitter: https://twitter.com/arayutw
	Facebook: https://www.facebook.com/arayutw
	Google+: https://plus.google.com/114918692417332410369/
	E-mail: info@syncer.jp

	鈥� 銉愩偘銆佷笉鍏峰悎銇牨鍛娿€佹彁妗堛€併仈瑕佹湜銇仼銆併亰寰呫仭銇椼仸銇娿倞銇俱仚銆�
	鈥� 鐢炽仐瑷炽亗銈娿伨銇涖倱銇屻€併仈鍒╃敤鑰呮銆佸€嬨€呫伄鐠板銇亰銇戙倠鍟忛銇偟銉濄兗銉堛仐銇︺亜銇俱仜銈撱€�

********************************************************************************/


// 銈般儹銉笺儛銉鏁�
var syncerSounds = {
	flag: {} ,
	currentTime: null ,
} ;

// 鍗虫檪闁㈡暟
(function()
{
	// 瑷畾
	var setClass = 'sounds' ;							// 銉溿偪銉宠绱犮伄銈儵銈瑰悕
	var setDir = '' ;									// 闊冲０銉曘偂銈ゃ儷銇屻亗銈嬨儠銈┿儷銉€(鏈€寰屻伅[/])
	var setStopButtonId = 'stop-button-syncer' ;			// 鍋滄銉溿偪銉炽伀浠樸亼銈婭D

	// 銈儵銈瑰悕銇屼粯銇勩仧瑕佺礌銈掑彇寰椼仚銈�
	var sounds = document.getElementsByClassName( setClass ) ;

	// 鍏ㄣ仸銇绱犮伀銈儶銉冦偗銈ゃ儥銉炽儓銈掕ō瀹氥仚銈�
	for( var i=0,l=sounds.length ; l>i ; i++ )
	{
		// 銈儶銉冦偗銈ゃ儥銉炽儓銇ō瀹�
		sounds[i].onclick = function()
		{
			// 銉曘偂銈ゃ儷鍚嶃伄鍙栧緱
			var file = this.getAttribute( 'data-file' ) ;

			// 涓€搴︾敓鎴愩仐銇熴偍銉儭銉炽儓銇敓鎴愩仐銇亜
			if( typeof( syncerSounds.flag[ file ] )=="undefined" || syncerSounds.flag[ file ] != 1 )
			{
				// 鐢熸垚銇欍倠銈ㄣ儸銉°兂銉堛伄瑾挎暣
				var audio = document.createElement( 'audio' ) ;

				// 銈ㄣ儸銉°兂銉堛伄ID銈掓寚瀹�
				audio.id = file ;

				// 銉栥儵銈︺偠銇孾.mp3]銇蹇溿仐銇︺亜銈嬪牬鍚堛伅[.mp3]銈掕銇胯炯銈€
				if( audio.canPlayType( 'audio/mp3' ) )
				{
					audio.src = setDir + file + '.mp3' ;
				}

				// 銉栥儵銈︺偠銇孾.wav]銇蹇溿仐銇︺亜銈嬪牬鍚堛伅[.wav]銈掕銇胯炯銈€
				else if( audio.canPlayType( 'audio/wav' ) )
				{
					audio.src = setDir + file + '.wav' ;
				}

				// [audio]銈掔敓鎴愩仚銈�
				document.body.appendChild( audio ) ;
			}

			// 鍒濆洖鍐嶇敓浠ュ銇犮仯銇熴倝闊冲０銉曘偂銈ゃ儷銈掑坊銇嶆埢銇�
			stopCurrentSound() ;

			// 闊冲０銉曘偂銈ゃ儷銈掑啀鐢焄play()]銇欍倠
			document.getElementById( file ).play() ;

			// 鏈€杩戝啀鐢熴仐銇熼煶澹般仺銇椼仸銈汇儍銉�
			syncerSounds.currentTime = file ;

			// 鍒濆洖鍐嶇敓銇岀祩銈忋仯銇熷垽瀹氱敤銇玔syncerSounds.flag]銇€ゃ倰0銇嬨倝1銇鏇淬仚銈�
			// 銈ㄣ儸銉°兂銉堛倰浣曞害銈傜敓鎴愩仐銇亜銈堛亞銇仚銈嬨仧銈�
			syncerSounds.flag[ file ] = 1 ;

			// 绲備簡
			return false ;
		}
	}

	// 鍓嶅洖銇煶澹般倰鍋滄銇欍倠闁㈡暟
	function stopCurrentSound()
	{
		var currentSound = document.getElementById( syncerSounds.currentTime ) ;

		if( currentSound != null )
		{
			currentSound.pause() ;
			currentSound.currentTime = 0 ;
		}
	}


	// 鍋滄銉溿偪銉炽倰銈儶銉冦偗銇椼仧鏅傘伄銈ゃ儥銉炽儓
	document.getElementById( setStopButtonId ).onclick = function()
	{
		stopCurrentSound() ;
		return false ;
	}

})() ;