// 이미지를 업로드 하는 함수
export async function uploadImage(file) {

    // FormData 객체를 생성해 이미지와 관련된 데이터를 담음
    const data = new FormData();

    // 이미지 파일을 FormData에 첨부
    data.append('file', file);

    // 사전 설정된 이미지 업로드 설정
    data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);

    // cloudinary url로 post 요청 보냄
    return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
        method: 'POST', // http 요청 메소드는 post
        body: data, // 요청 본문에 FormData 객체를 담아 전송
    })

        // 응답은 json 형태로 파싱
        .then((res) => res.json())

        // 파싱된 json에서 이미지 url을 추출해서 반환
        .then((data) => data.url);

}