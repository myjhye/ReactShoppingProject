// 이미지 업로드 함수
export async function uploadImage(file) {

    // FormData 객체 생성 -> 이미지 관련 데이터 담음
    const data = new FormData();

    // 이미지 파일 -> FormData에 첨부
    data.append('file', file);

    // 사전 설정된 이미지 업로드 설정
    data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);

    // cloudinary url로 post 요청 보냄
    return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
        // http 요청 메소드 -> post
        method: 'POST', 
        // 요청 본문에 FormData 객체를 담아 -> 전송
        body: data, 
    })

        // 응답 -> json 형태로 파싱
        .then((res) => res.json())

        // 파싱된 json -> 이미지 url을 추출 -> 반환
        .then((data) => data.url);

}