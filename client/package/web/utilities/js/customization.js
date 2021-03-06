var gender = true;
var customizationTimer = setInterval(() => {

    var charInfo = [];
    var charOverlay = [];
    var hairColor = 0;

    var father = Number($("#father").val());
    var mother = Number($("#mother").val());

    var fatherblend = $("#fatherblend").val() / 100;
    var motherblend = $("#motherblend").val() / 100;
    var blendmixture = $("#mixture").val() / 100;

    var faceblend = [];
    faceblend[0] = $("#nose_width").val() / 100;
    faceblend[1] = $("#nose_height").val() / 100;
    faceblend[2] = $("#nose_length").val() / 100;
    faceblend[3] = $("#nose_bridge").val() / 100;
    faceblend[4] = $("#nose_tip").val() / 100;
    faceblend[5] = $("#nose_shift").val() / 100;

    faceblend[6] = $("#brow_height").val() / 100;
    faceblend[7] = $("#brow_width").val() / 100;

    faceblend[8] = $("#check_height").val() / 100;
    faceblend[9] = $("#check_width").val() / 100;
    faceblend[10] = $("#checks_width").val() / 100;

    faceblend[11] = $("#eyes").val() / 100;
    faceblend[12] = $("#lips").val() / 100;

    faceblend[13] = $("#jaw_width").val() / 100;
    faceblend[14] = $("#jaw_height").val() / 100;

    faceblend[15] = $("#chin_length").val() / 100;
    faceblend[16] = $("#chin_position").val() / 100;
    faceblend[17] = $("#chin_width").val() / 100;
    faceblend[18] = $("#chin_shape").val() / 100;
    faceblend[19] = $("#neck").val() / 100;

    charOverlay[0] = Number($("#blemishes").val() / 1);
    charOverlay[1] = Number($("#facialhair").val() / 1);
    charOverlay[2] = Number($("#eyebrows").val() / 1);
    charOverlay[3] = Number($("#ageing").val() / 1);
    charOverlay[4] = Number($("#makeup").val() / 1);
    charOverlay[5] = Number($("#blush").val() / 1);
    charOverlay[6] = Number($("#complexion").val() / 1);
    charOverlay[7] = Number($("#sundamage").val() / 1);
    charOverlay[8] = Number($("#lipstick").val() / 1);
    charOverlay[9] = Number($("#holes").val() / 1);
    charOverlay[10] = Number($("#bodyhair").val() / 1);

    hairColor = Number($("#haircolor").val());


    var rotation = Number($("#rotation").val());

    charInfo = JSON.stringify({
        gender: gender,
        father: father,
        mother: mother,
        fatherblend: fatherblend,
        motherblend: motherblend,
        blendmixture: blendmixture,
        rotation: rotation,
        faceblend: faceblend,
        overlay: charOverlay,
        haircolor: hairColor
    });

    mp.trigger("receiveCharacterInformation", charInfo);

}, 50);

function selectMale() { mp.trigger("selectedGender", false); gender = true; }
function selectFemale() { mp.trigger("selectedGender", true); gender = false; }

function acceptCustomization(){

        mp.trigger("acceptCustomizationChanged");
}

function translateRussian()
{
        document.getElementById("labelFather").innerHTML = "????????:";
        document.getElementById("labelMother").innerHTML = "????????:";
    
        document.getElementById("labelFatherblend").innerHTML = "?????????????????? ??????????:";
        document.getElementById("labelMotherblend").innerHTML = "?????????????????????? ??????????:";
        document.getElementById("labelMixture").innerHTML = "??????????:";
    
        document.getElementById("labelNeck").innerHTML = "??????:";  
        document.getElementById("labelHaircolor").innerHTML = "???????? ??????????:";  

        document.getElementById("labelnose_width").innerHTML = "???????????? ??????????:";
        document.getElementById("labelnose_height").innerHTML = "???????????? ????????:";
        document.getElementById("labelnose_length").innerHTML = "?????????? ????????:";  
        document.getElementById("labelnose_bridge").innerHTML = "???????????? ????????:";  
        document.getElementById("labelnose_tip").innerHTML = "???????????? ????????:";  
        document.getElementById("labelnose_shift").innerHTML = "?????????? ????????:";  
    
        document.getElementById("labelbrow_height").innerHTML = "???????????? ????????????:";  
        document.getElementById("labelbrow_width").innerHTML = "???????????? ????????????:";  

        document.getElementById("labeleyes").innerHTML = "??????????:";  

        document.getElementById("labelcheck_height").innerHTML = "???????????? ????????:"; 
        document.getElementById("labelcheck_width").innerHTML = "???????????? ????????:";  
        document.getElementById("labelchecks_width").innerHTML = "??????????:";  
    
       
        document.getElementById("labellips").innerHTML = "????????:";  
    
        document.getElementById("labeljaw_width").innerHTML = "???????????? ??????????????:";  
        document.getElementById("labeljaw_height").innerHTML = "???????????? ??????????????:";  
    
        document.getElementById("labelchin_length").innerHTML = "?????????? ????????????????????:";   
        document.getElementById("labelchin_position").innerHTML = "?????????????? ????????????????????:"; 
        document.getElementById("labelchin_width").innerHTML = "???????????? ????????????????????:";  
        document.getElementById("labelchin_shape").innerHTML = "?????????? ????????????????????:";   
    
        document.getElementById("labelblemishes").innerHTML = "??????????:";  
        document.getElementById("labelfacialhair").innerHTML = "???????????? ???? ????????:";  
        document.getElementById("labeleyebrows").innerHTML = "??????????:";  
        document.getElementById("labelageing").innerHTML = "????????????????:";  
        document.getElementById("labelmakeup").innerHTML = "????????????:";  
        document.getElementById("labelblush").innerHTML = "??????????????:";  
        document.getElementById("labelcomplexion").innerHTML = "???????? ????????:";   
        document.getElementById("labelsundamage").innerHTML = "??????????????:";   
        document.getElementById("labellipstick").innerHTML = "????????????:";   
        document.getElementById("labelholes").innerHTML = "??????????:";   
        document.getElementById("labelbodyhair").innerHTML = "???????????? ???? ????????:";   

        document.getElementById("buttonAccept").innerHTML = "??????????????";
        document.getElementById("buttonMale").innerHTML = "?????????????? ??????";
        document.getElementById("buttonFemale").innerHTML = "?????????????? ??????";

        document.getElementById("dns").innerHTML = "??????";
        document.getElementById("nose").innerHTML = "??????";
        document.getElementById("eyes").innerHTML = "??????????";
        document.getElementById("face").innerHTML = "????????";
        document.getElementById("cosmetic").innerHTML = "??????????????????";
}

function translateEnglish()
{
        document.getElementById("labelFather").innerHTML = "Father:";
        document.getElementById("labelMother").innerHTML = "Mother:";
    
        document.getElementById("labelFatherblend").innerHTML = "Fatherblend:";
        document.getElementById("labelMotherblend").innerHTML = "Motherblend:";
        document.getElementById("labelMixture").innerHTML = "Mixture:";
    
        document.getElementById("labelNeck").innerHTML = "Neck:";  
        document.getElementById("labelHaircolor").innerHTML = "Haircolor:";  

        document.getElementById("labelnose_width").innerHTML = "Nose width:";
        document.getElementById("labelnose_height").innerHTML = "Nose height:";
        document.getElementById("labelnose_length").innerHTML = "Nose length:";  
        document.getElementById("labelnose_bridge").innerHTML = "Bridge:";  
        document.getElementById("labelnose_tip").innerHTML = "Nosetip:";  
        document.getElementById("labelnose_shift").innerHTML = "Nose shift:";  
    
        document.getElementById("labelbrow_height").innerHTML = "Brow height:";  
        document.getElementById("labelbrow_width").innerHTML = "Brow width:";  

        document.getElementById("labeleyes").innerHTML = "Eyes:";  

        document.getElementById("labelcheck_height").innerHTML = "Cheeck height:"; 
        document.getElementById("labelcheck_width").innerHTML = "Cheeck width:";  
        document.getElementById("labelchecks_width").innerHTML = "Cheeckbones:";  
    
       
        document.getElementById("labellips").innerHTML = "Lips:";  
    
        document.getElementById("labeljaw_width").innerHTML = "Jaw width:";  
        document.getElementById("labeljaw_height").innerHTML = "Jaw height:";  
    
        document.getElementById("labelchin_length").innerHTML = "Chin length:";   
        document.getElementById("labelchin_position").innerHTML = "Chin position:"; 
        document.getElementById("labelchin_width").innerHTML = "Chin width:";  
        document.getElementById("labelchin_shape").innerHTML = "Chin shape:";   
    
        document.getElementById("labelblemishes").innerHTML = "Blemishes:";  
        document.getElementById("labelfacialhair").innerHTML = "Facial hair:";  
        document.getElementById("labeleyebrows").innerHTML = "Eyebrows:";  
        document.getElementById("labelageing").innerHTML = "Ageing:";  
        document.getElementById("labelmakeup").innerHTML = "Makeup:";  
        document.getElementById("labelblush").innerHTML = "Blush:";  
        document.getElementById("labelcomplexion").innerHTML = "Complexion:";   
        document.getElementById("labelsundamage").innerHTML = "Sundamage:";   
        document.getElementById("labellipstick").innerHTML = "Lipstick:";   
        document.getElementById("labelholes").innerHTML = "Holes:";   
        document.getElementById("labelbodyhair").innerHTML = "Bodyhair:";   

        document.getElementById("buttonAccept").innerHTML = "Create";
        document.getElementById("buttonMale").innerHTML = "Male";
        document.getElementById("buttonFemale").innerHTML = "Female";

        document.getElementById("dns").innerHTML = "DNS";
        document.getElementById("nose").innerHTML = "Nose";
        document.getElementById("eyes").innerHTML = "Eyes";
        document.getElementById("face").innerHTML = "Face";
        document.getElementById("cosmetic").innerHTML = "Cosmetics";
}