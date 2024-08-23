// 상품 생성

import React, { useState } from "react";
import Button from "../components/ui/Button";
import { uploadImage } from "../api/uploader";
import { addNewProduct } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { v4 as uuid } from "uuid";

export default function NewProduct() {
  
  
  const navigate = useNavigate();
  
  // 현재 로그인한 유저 uid
  const { uid } = useAuthContext();
  const currentDate = new Date();
  
  // 고유 상품 아이디 -> 랜덤 생성
  const id = uuid();

  // 새로 등록하는 상품 객체
  const [product, setProduct] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    gender: "",
    options: [],
    date: currentDate.toISOString(),
  });

  // 업로드할 이미지 파일
  const [file, setFile] = useState();

  // 이미지 업로드 중 여부
  const [isUploading, setIsUploading] = useState(false);

  // 제품 등록 성공 여부
  const [success, setSuccess] = useState();



  // 입력 값 변경 핸들러
  const handleChange = (e) => {

    const target = e.target;

    // 이미지 파일 선택 시
    if (target.name === "file") {
      
      // 선택한 이미지 파일을 'file' 상태로 설정
      setFile(target.files && target.files[0]);

      return;
    }

    // 사이즈 옵션 체크박스 처리
    if (target.name === "options") {

      // 새로운 사이즈 옵션 배열 생성
      const updatedOptions = target.checked

        // 체크된 상태면 옵션 추가
        ? [...product.options, target.value]
        // 미체크시 해당 옵션 제거 (filter 사용: 배열에서 특정 값 제거)
        : product.options.filter((option) => option !== target.value);


      // 옵션을 "XS", "S", "M", "L", "XL" 순서로 정렬하고 업데이트
      // 사용자가 선택한 옵션들(updatedOptions)를 특정 순서("XS", "S", "M", "L", "XL")대로 유지해 새 배열(sortedOptions) 만들기
      // filter 사용: 배열에서 주어진 조건을 만족하는 요소들만 선택해 새 배열 만들기
      const sortedOptions = ["XS", "S", "M", "L", "XL"].filter((option) =>
        updatedOptions.includes(option)
      );

      // 빈 상품 값(product)에 선택한 options(sortedOptions) 추가
      setProduct((product) => ({
        ...product,
        options: sortedOptions,
      }));

      return;
    }


    // 나머지 입력 필드 처리(sortedOptions 외 다른 상품 값들 업데이트) -> 상품명, 가격, 설명 등
    setProduct((product) => ({
      ...product,
      // 입력한 필드 값을 상태에 반영
      [target.name]: target.value,
    }));
  };





  // 제품 등록
  const handleSubmit = (e) => {

    e.preventDefault();

    // 이미지 업로드 중 표시
    setIsUploading(true);


    // 이미지 업로드한 파일을 url로 받아와서 -> firebase에 제품 정보 추가
    // file: 사용자가 선택한 이미지 파일
    uploadImage(file)
      .then((url) => {
        // 상품 추가
        // id: 고유 상품 아이디
        // product: 사용자가 입력한 상품 정보 객체
        // url: 업로드된 이미지 파일 url
        // uid: 현재 로그인한 사용자 고유 아이디
        addNewProduct(id, product, url, uid)
          .then(() => {
            navigate("/");
            alert("성공적으로 제품이 추가되었습니다!");
        });
      })

      // 이미지 업로드 중 해제
      .finally(() => setIsUploading(false));
  };




  // 필수 항목(사이즈, 성별, 카테고리) 모두 선택했는지 확인
  // 하나 이상 옵션이 포함되면 true, 아니면 false
  const isOptionsSelected = product.options.length > 0;
  const isGenderSelected = product.gender.length > 0;
  const isCategorySelected = product.category.length > 0;





  return (
    <section className="w-full text-center">
      <h2 className="text-2xl font-bold my-4">새로운 제품 등록</h2>

      {/* 이미지 미리보기 */}
      {file && (
        <img
          className="w-96 mx-auto mb-2"
          src={URL.createObjectURL(file)}
          alt="local file"
        />
      )}

      <form 
        className="flex flex-col px-12" 
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          accept="image/*"
          name="file"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="title"
          value={product.title}
          placeholder="제품명"
          required
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          value={product.price}
          placeholder="가격"
          required
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          value={product.description}
          placeholder="제품 설명"
          required
          onChange={handleChange}
        />
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="gender"
              value="여성"
              // product.gender에 '여성' 값 있는지 확인 -> true면 체크
              checked={product.gender.includes("여성")}
              onChange={handleChange}
            />
            여성
          </label>
          <label>
            <input
              type="checkbox"
              name="gender"
              value="남성"
              checked={product.gender.includes("남성")}
              onChange={handleChange}
            />
            남성
          </label>
          <label>
            <input
              type="checkbox"
              name="gender"
              value="공용"
              checked={product.gender.includes("공용")}
              onChange={handleChange}
            />
            공용
          </label>
        </div>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="category"
              value="상의"
              checked={product.category.includes("상의")}
              onChange={handleChange}
            />
            상의
          </label>
          <label>
            <input
              type="checkbox"
              name="category"
              value="하의"
              checked={product.category.includes("하의")}
              onChange={handleChange}
            />
            하의
          </label>
          <label>
            <input
              type="checkbox"
              name="category"
              value="원피스"
              checked={product.category.includes("원피스")}
              onChange={handleChange}
            />
            원피스
          </label>
          <label>
            <input
              type="checkbox"
              name="category"
              value="모자"
              checked={product.category.includes("모자")}
              onChange={handleChange}
            />
            모자
          </label>
          <label>
            <input
              type="checkbox"
              name="category"
              value="신발"
              checked={product.category.includes("신발")}
              onChange={handleChange}
            />
            신발
          </label>
          <label>
            <input
              type="checkbox"
              name="category"
              value="기타"
              checked={product.category.includes("기타")}
              onChange={handleChange}
            />
            기타
          </label>
        </div>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="options"
              value="XS"
              checked={product.options.includes("XS")}
              onChange={handleChange}
            />
            XS
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="S"
              checked={product.options.includes("S")}
              onChange={handleChange}
            />
            S
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="M"
              checked={product.options.includes("M")}
              onChange={handleChange}
            />
            M
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="L"
              checked={product.options.includes("L")}
              onChange={handleChange}
            />
            L
          </label>
          <label>
            <input
              type="checkbox"
              name="options"
              value="XL"
              checked={product.options.includes("XL")}
              onChange={handleChange}
            />
            XL
          </label>
        </div>

        {/* 성별, 카테고리, 사이즈 옵션 체크 되었을 때 업로드 버튼 활성화 */}
        {isGenderSelected && isCategorySelected && isOptionsSelected ? (
          <Button
            text={isUploading ? "업로드 중.." : "제품 등록하기"}
            disabled={isUploading}
          />
        ) : (
          <p className="text-red-500">
            모든 필수 선택 사항을 완료 해주세요
          </p>
        )}
      </form>
    </section>
  );
}